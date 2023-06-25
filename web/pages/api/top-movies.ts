import { NextApiRequest, NextApiResponse } from "next";
import { TMDBNodeApi } from "tmdb-js-node";

const apiKey = process.env.TMDB_API_KEY || (() => {
  console.error("No TMDB API key supplied - use TMDB_API_KEY env variable");
  process.exit(-1);
})();
const api = new TMDBNodeApi(apiKey);

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // 20 results per page - get the first 200 results i.e. 10 pages
  const topMovieRequestParams = Array(10).fill(0).map((_, i) => i + 1).map(page => {
    return {
      include_adult: true,
      include_video: false,
      language: "en-US",
      page,
      sort_by: "popularity.desc",
    }
  });

  const topMovieResults = await Promise.all(topMovieRequestParams.map(p => api.v3.discover.movieDiscover(p)));
  const topMovies = topMovieResults.map(r => r.results).flat();

  response.setHeader("Cache-Control", `s-maxage=${60 * 60 * 24}, public`);
  return response.status(200).json(topMovies);
}
