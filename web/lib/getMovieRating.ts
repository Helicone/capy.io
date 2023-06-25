import { MovieRating } from "@/pages/api/movieRating";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";

export function getMovieRatings(userId: string): MovieRating[] {
  console.log("userId", userId);
  return [];
}
