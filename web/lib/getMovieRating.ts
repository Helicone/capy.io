import { MovieRating } from "@/pages/api/movieRating";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export async function getMovieRatings(userId: string): Promise<MovieRating[]> {
  // const pets = await client.sql`SELECT * FROM Pets;`;
  console.log("userId", userId);
  return [];
}
