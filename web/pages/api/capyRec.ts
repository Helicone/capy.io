import { getMovieRatings } from "@/lib/getCapyRec";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

type CapyRecRequest = {
  usernames: string[];
};

type CapyRecResponse = { capyMovieRecs: CapyMovieRec[] } | { error: string };

export interface CapyMovieRec {
  imbdId: string;
  title: string;
  posterUrl: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CapyRecResponse>) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (req.method === "POST") {
      const { usernames } = req.body as CapyRecRequest;
      let userIds: string[];
      try {
        userIds = (await clerkClient.users.getUserList({ username: usernames })).map((user) => user.id);
      } catch (error) {
        return res.status(500).json({
          error: "Failed to fetch user list.",
        });
      }

      userIds.push(userId);

      let capyMovieRecs: CapyMovieRec[];
      try {
        capyMovieRecs = await getMovieRatings(userIds);
      } catch (error) {
        return res.status(500).json({
          error: "Failed to fetch movie ratings.",
        });
      }

      return res.status(200).json({ capyMovieRecs });
    }

    return res.status(404).json({
      error: "Method not found for movieRating, only POST works dog come on do better.",
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({
      error: `An unexpected error occurred: ${error || "Internal Server Error"}`,
    });
  }
}
