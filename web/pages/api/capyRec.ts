import { getAuth } from "@clerk/nextjs/server";
import { db } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

type CapyRecRequest = {
  userIds: string[];
};

type CapyRecResponse = {
  movieRecs: MovieRec[];
};

interface MovieRec {
  imbdId: string;
  title: string;
  posterUrl: string;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CapyRecResponse>
) {
  const { userId } = getAuth(req);
  const client = await db.connect();

  if (req.method === "POST") {
    const { userIds } = req.body as CapyRecRequest;
    // const movieRecs = await getMovieRecs(userIds);
    // return res.status(200).json({ movieRecs });
  }

  try {
    await client.sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
    const names = ["Fiona", "Lucy"];
    await client.sql`INSERT INTO Pets (Name, Owner) VALUES (${names[0]}, ${names[1]});`;
  } catch (error) {
    // return response.status(500).json({ error });
  }

  const pets = await client.sql`SELECT * FROM Pets;`;
  // return response.status(200).json({ pets });
}
