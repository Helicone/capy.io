import { getMovieRatings } from "@/lib/getCapyRec";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

type CapyRecRequest = {
  usernames: string[];
};

export type CapyRecResponse = { capyMovieRecs: CapyMovieRec[] } | { error: string };

export interface CapyMovieRec {
  imdbID: string;
  title: string;
  posterUrl: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CapyRecResponse>) {
  console.log("Handler started"); // Added console log
  try {
    const { userId } = getAuth(req);
    console.log("User ID:", userId); // Added console log
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (req.method === "POST") {
      const { usernames } = req.body as CapyRecRequest;
      console.log("Usernames:", usernames); // Added console log
      let userIds: string[];
      try {
        userIds = (await clerkClient.users.getUserList({ username: usernames })).map((user) => user.id);
        console.log("User IDs:", userIds); // Added console log
      } catch (error) {
        console.error("Error fetching user list:", error); // Added console log
        return res.status(500).json({
          error: "Failed to fetch user list.",
        });
      }

      userIds.push(userId);

      let capyMovieRecs: CapyMovieRec[];
      try {
        capyMovieRecs = await getMovieRatings(userIds);
        console.log("Capy movie recommendations:", capyMovieRecs); // Added console log
      } catch (error) {
        console.error("Error fetching movie ratings:", error); // Added console log
        throw error;
      }

      return res.status(200).json({ capyMovieRecs });
    }

    console.log("Unsupported request method"); // Added console log
    return res.status(404).json({
      error: "Method not found for movieRating, only POST works dog come on do better.",
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("An unexpected error occurred:", error); // Added console log
    return res.status(500).json({
      error: `An unexpected error occurred: ${JSON.stringify(error)} ${error || "Internal Server Error"}`,
    });
  }
}
