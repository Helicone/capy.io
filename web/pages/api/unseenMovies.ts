import { getAuth } from "@clerk/nextjs/server";
import { db } from "@vercel/postgres";
import type { NextApiRequest, NextApiResponse } from "next";

type UnseenMoviesResponse =
  | {
      unseenMovies: UnseenMovie[];
    }
  | {
      error: string;
    };

type UnseenMovie = {
  imbdid: string;
  user_id: string;
};

type UnseenMovieDto = {
  movie: string;
  user_id: string;
};

// Post da review up in here
export default async function handler(req: NextApiRequest, res: NextApiResponse<UnseenMoviesResponse>) {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  if (req.method === "GET") {
    const client = await db.connect();
    const unseenMovieQueryResult =
      await client.sql<UnseenMovieDto>`SELECT * FROM user_to_movie_meta WHERE user_id = ${userId} AND has_seen = false;`;

    const unseenMoviesDto = unseenMovieQueryResult.rows;

    const unseenMovies: UnseenMovie[] = unseenMoviesDto.map((unseenMovieDto) => {
      return {
        imbdid: unseenMovieDto.movie,
        user_id: unseenMovieDto.user_id,
      };
    });

    res.status(200).json({ unseenMovies });
    return;
  } else {
    res.status(404).json({
      error: "Method not found for movieRating, only POST works dog come on do better.",
    });
  }
}
