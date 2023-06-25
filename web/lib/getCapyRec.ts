import { CapyMovieRec } from "@/pages/api/capyRec";
import { VercelPoolClient, db } from "@vercel/postgres";
import { Configuration, OpenAIApi } from "helicone-openai";
import { TMDBNodeApi } from "tmdb-js-node";
import { capyRecSystemPrompt } from "./prompts";

const apiKey =
  process.env.TMDB_API_KEY ||
  (() => {
    console.error("No TMDB API key supplied - use TMDB_API_KEY env variable");
    process.exit(-1);
  })();
const api = new TMDBNodeApi(apiKey);

interface Review {
  user_id: string | null;
  accepted_movie: string | null;
  rejected_movie: string | null;
  created_at: Date | null;
}

interface UnseenMovie {
  user_id: string;
  movie: string;
}

interface CapyRec {
  title: string;
  imbdId: string;
}
export async function getMovieRatings(userIds: string[]): Promise<CapyMovieRec[]> {
  console.log("getMovieRatings started"); // Added console log
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY!,
      heliconeApiKey: process.env.HELICONE_API_KEY,
    });
    console.log("Configuration created:", configuration); // Added console log

    const client = await db.connect();
    console.log("Database client connected"); // Added console log

    console.log(`UserIDs passed in: ${userIds}`); // Added console log
    const reviews = await fetchUserReviews(userIds, client);
    console.log("Fetched user reviews:", reviews); // Added console log

    const unseenMovies = await fetchUnseenMovies(userIds, client);
    console.log("Fetched unseen movies:", unseenMovies); // Added console log

    const groupedRatings = groupRatingsByUser(reviews, unseenMovies);
    console.log("Grouped ratings by user:", groupedRatings); // Added console log

    const movieReviews = formatGroupedRatingsForOpenAI(groupedRatings);
    console.log("Formatted grouped ratings for OpenAI:", movieReviews); // Added console log

    const recommendations = await fetchOpenAIRecommendations(movieReviews, configuration);
    console.log("Fetched recommendations from OpenAI:", recommendations); // Added console log

    const formattedMovies = await formatMovieRecommendations(recommendations);
    console.log("Formatted movie recommendations:", formattedMovies); // Added console log

    return formattedMovies;
  } catch (error) {
    console.error("An unexpected error occurred in getMovieRatings:", error); // Updated console error log
    throw error;
  }
}

async function formatMovieRecommendations(capyRecs: CapyRec[]): Promise<CapyMovieRec[]> {
  const recommendationPromises = capyRecs.map(async (rec) => {
    try {
      const { imbdId, title } = rec;
      const additionalInfo = await fetchMovieInformation(imbdId);
      return {
        imbdId,
        title,
        posterUrl: additionalInfo.posterUrl,
        description: additionalInfo.description,
      };
    } catch (error) {
      console.error("Error fetching movie information:", error);
      throw error;
    }
  });

  return Promise.all(recommendationPromises);
}

async function fetchMovieInformation(imdbId: string): Promise<{ posterUrl: string; description: string }> {
  try {
    const response = await api.v3.find.findById(imdbId, {
      external_source: "imdb_id",
    });
    return {
      posterUrl: "https://image.tmdb.org/t/p/w780" + response.movie_results[0].poster_path,
      description: response.movie_results[0].overview,
    };
  } catch (error) {
    console.error("Error fetching movie from TMDB API:", error);
    throw new Error("TMDB API error");
  }
}

function groupRatingsByUser(
  reviews: Review[],
  unseenMovies: UnseenMovie[]
): Record<string, { preferred: string[]; unpreferred: string[]; notSeen: string[] }> {
  const groupedRatings: Record<string, { preferred: string[]; unpreferred: string[]; notSeen: string[] }> = {};

  for (const review of reviews) {
    if (!review.user_id) continue; // Skip if user_id is null

    if (!groupedRatings[review.user_id]) {
      groupedRatings[review.user_id] = {
        preferred: [],
        unpreferred: [],
        notSeen: [],
      };
    }

    if (review.accepted_movie) {
      groupedRatings[review.user_id].preferred.push(review.accepted_movie);
    }

    if (review.rejected_movie) {
      groupedRatings[review.user_id].unpreferred.push(review.rejected_movie);
    }
  }

  for (const unseenMovie of unseenMovies) {
    if (!groupedRatings[unseenMovie.user_id]) {
      groupedRatings[unseenMovie.user_id] = {
        preferred: [],
        unpreferred: [],
        notSeen: [],
      };
    }
    groupedRatings[unseenMovie.user_id].notSeen.push(unseenMovie.movie);
  }

  return groupedRatings;
}

function formatGroupedRatingsForOpenAI(groupedRatings: ReturnType<typeof groupRatingsByUser>): string {
  let movieReviews = "";

  let i = 1;
  for (const userId in groupedRatings) {
    movieReviews += `User ${i}\n Ratings`;
    movieReviews += "Preferred | Unpreferred\n";
    const preferredMovies = groupedRatings[userId].preferred;
    const unpreferredMovies = groupedRatings[userId].unpreferred;
    const notSeenMovies = groupedRatings[userId].notSeen;

    const maxLines = Math.max(preferredMovies.length, unpreferredMovies.length);
    for (let i = 0; i < maxLines; i++) {
      const preferred = preferredMovies[i] || "";
      const unpreferred = unpreferredMovies[i] || "";
      movieReviews += `${preferred} | ${unpreferred}\n`;
    }

    movieReviews += "\nNot Seen\n";
    for (const notSeen of notSeenMovies) {
      movieReviews += `${notSeen}\n`;
    }

    movieReviews += "\n";
    i++;
  }

  return movieReviews;
}

async function fetchOpenAIRecommendations(movieReviews: string, configuration: Configuration) {
  try {
    const openai = new OpenAIApi(configuration);
    let completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: capyRecSystemPrompt,
        },
        { role: "user", content: `Give 2 movie recommendations for the following user(s): ${movieReviews}` },
      ],
    });

    console.log("OpenAI completion:", completion); // Added console log
    const content = completion.data.choices[0].message?.content!;
    const jsonSubstring = content.substring(content.indexOf("["), content.lastIndexOf("]") + 1);

    console.log("JSON substring:", jsonSubstring); // Added console log

    try {
      // Try parsing the JSON
      return JSON.parse(jsonSubstring);
    } catch (parsingError) {
      // If parsing fails, use GPT-3.5-turbo to fix the JSON
      console.error("Error parsing JSON, trying to fix with GPT-3.5-turbo:", parsingError);

      const fixedJSONCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that corrects JSON syntax.",
          },
          {
            role: "user",
            content: `You are a helpful assistant that corrects JSON syntax to this valid structure:
            """
            [
                {title: string, imbdId: string},
                {title: string, imbdId: string},
            ]
            """
            Please correct the following JSON:\n${jsonSubstring}`,
          },
        ],
      });

      const fixedJSONContent = fixedJSONCompletion.data.choices[0].message?.content!;

      try {
        // Try parsing the corrected JSON
        return JSON.parse(fixedJSONContent);
      } catch (secondParsingError) {
        // If parsing the corrected JSON fails as well
        console.error("Error parsing corrected JSON from GPT-3.5-turbo:", secondParsingError);
        throw new Error("JSON parsing error after correction attempt");
      }
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

async function fetchUserReviews(userIds: string[], client: VercelPoolClient): Promise<Review[]> {
  try {
    const reviews: Review[] = [];

    for (const userId of userIds) {
      const queryResult = await client.sql<Review>`SELECT * FROM reviews WHERE user_id = ${userId}`;
      reviews.push(...queryResult.rows);
    }

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews from database:", error);
    throw new Error("Database error");
  }
}

async function fetchUnseenMovies(userIds: string[], client: VercelPoolClient): Promise<UnseenMovie[]> {
  try {
    const unseenMovies: UnseenMovie[] = [];

    for (const userId of userIds) {
      const queryResponse = await client.sql<UnseenMovie>`SELECT user_id, movie FROM user_to_movie_meta WHERE has_seen = false and user_id = ${userId}`;
      unseenMovies.push(...queryResponse.rows);
    }

    return unseenMovies;
  } catch (error) {
    console.error("Error fetching unseen movies from database:", error);
    throw new Error("Database error");
  }
}

