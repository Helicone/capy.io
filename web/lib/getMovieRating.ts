import { MovieRating } from "@/pages/api/movieRating";
import { db } from "@vercel/postgres";

export async function getMovieRatings(userId: string): Promise<MovieRating[]> {
  const client = await db.connect();

  const { rows, command } =
    await client.sql`SELECT * FROM reviews where user_id = ${userId};`;
  console.log("commmand", command);
  console.log("rows", rows);

  return rows.map((row) => ({
    acceptedMovieImbdId: row.accepted_movie,
    rejectedMovieImbdId: row.rejected_movie,
    createdAt: new Date(row.created_at),
  }));
}
