import { getMovieRatings } from "../../lib/getMovieRating";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@vercel/postgres";
import type { NextApiRequest, NextApiResponse } from "next";

type MovieRatingResponse =
  | {
      error?: string;
    }
  | {
      ratings: MovieRating[];
    };

export interface MovieRating {
  acceptedMovieImbdId: string;
  rejectedMovieImbdId: string;
  createdAt?: Date;
}

// Post da review up in here
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovieRatingResponse>
) {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  if (req.method === "POST") {
    const movieRating = JSON.parse(req.body) as MovieRating;
    const client = await db.connect();
    await client.sql`INSERT INTO reviews (user_id, accepted_movie, rejected_movie) VALUES (${userId}, ${movieRating.acceptedMovieImbdId}, ${movieRating.rejectedMovieImbdId});`;
    res.status(200);
    return;
  } else if (req.method === "GET") {
    const ratings = await getMovieRatings(userId);
    res.status(200).json({
      ratings,
    });
  } else {
    res.status(404).json({
      error:
        "Method not found for movieRating, only POST works dog come on do better.",
    });
  }
}

/*

get movies for rating

post movie rating
- Preferred movie
- Not preferred movie
- Not seen movie
- Imbdid

get rec

get rec w/ other users

*/
