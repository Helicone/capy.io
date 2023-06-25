import { MovieRating } from "@/pages/api/movieRating";
import { db } from "@vercel/postgres";

export async function getMovieRatings(userId: string): Promise<MovieRating[]> {
  const client = await db.connect();

  const { rows } =
    await client.sql`SELECT * FROM reviews where user = ${userId};`;
  console.log("rows", rows);

  return rows.map((row) => ({
    acceptedMovieImbdId: row.accepted_movie,
    rejectedMovieImbdId: row.rejected_movie,
    createdAt: new Date(row.created_at),
  }));
}
