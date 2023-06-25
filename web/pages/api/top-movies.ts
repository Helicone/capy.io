import { NextApiRequest, NextApiResponse } from "next";
import { DiscoverMovieDiscoverResult, TMDBNodeApi } from "tmdb-js-node";

const apiKey =
  process.env.TMDB_API_KEY ||
  (() => {
    console.error("No TMDB API key supplied - use TMDB_API_KEY env variable");
    process.exit(-1);
  })();
const api = new TMDBNodeApi(apiKey);

export type DiscoverMovieDiscoverResultExtended = DiscoverMovieDiscoverResult & { imdb_id: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // 20 results per page - get the first 200 results i.e. 10 pages
  const topMovieRequestParams = Array(10)
    .fill(0)
    .map((_, i) => i + 1)
    .map((page) => {
      return {
        include_adult: false,
        include_video: false,
        language: "en-US",
        page,
        sort_by: "popularity.desc",
      };
    });

  const topMovieResults = await Promise.all(
    topMovieRequestParams.map((p) => api.v3.discover.movieDiscover(p))
  );
  const topMovies = topMovieResults.map((r) => r.results).flat();

  // Add IMDB ID to each movie
  const externalIdsPromises = topMovies.map(movie =>
    api.v3.movies.getExternalIds(movie.id)
  );
  const externalIdsResults = await Promise.all(externalIdsPromises);

  // Map responses to DiscoverMovieDiscoverResultExtended
  const topMoviesExtended: DiscoverMovieDiscoverResultExtended[] = topMovies.map((movie, index) => ({
    ...movie,
    imdb_id: externalIdsResults[index].imdb_id,
  }));

  response.setHeader("Cache-Control", `s-maxage=${60 * 60 * 24}, public`);
  console.log(topMoviesExtended);
  return response.status(200).json(topMoviesExtended);
}
