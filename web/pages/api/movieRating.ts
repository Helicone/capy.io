import { getAuth } from "@clerk/nextjs/dist/types/server/getAuth";
import { db } from "@vercel/postgres";
import type { NextApiRequest, NextApiResponse } from "next";

type MovieRatingResponse = {
  error?: string;
};

interface MovieRating {
  acceptedMovieImbdId: string;
  rejectedMovieImbdId: string;
}

// Post da review up in here
export default async function handler(req: NextApiRequest, res: NextApiResponse<MovieRatingResponse>) {
  const { userId } = getAuth(req);

  if (req.method === "POST") {
    const movieRating = JSON.parse(req.body) as MovieRating;
    const client = await db.connect();
    await client.sql`INSERT INTO reviews (user_id, accepted_movie, rejected_movie) VALUES (${userId}, ${movieRating.acceptedMovieImbdId}, ${movieRating.rejectedMovieImbdId});`;
    res.status(200);
    return;
  }

  res.status(404).json({ error: "Method not found for movieRating, only POST works dog come on do better." });
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
