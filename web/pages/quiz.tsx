/* eslint-disable @next/next/no-img-element */
import BasePage from "@/components/basePage";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface QuizProps {}

function getRandomItems<T>(arr: T[], num: number): T[] {
  let tempArr = [...arr]; // Make a copy to not mutate the original array
  let result: T[] = [];

  for (let i = 0; i < num; i++) {
    if (tempArr.length === 0) {
      break;
    }
    const randomIndex = Math.floor(Math.random() * tempArr.length);
    const randomItem = tempArr[randomIndex];
    result.push(randomItem);
    tempArr.splice(randomIndex, 1); // Remove the used item
  }
  return result;
}

const Quiz = (props: QuizProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["top-movies"],
    queryFn: async () => {
      const resp = await fetch("/api/top-movies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      //   console.log("resp", await resp.json());
      return resp.json();
    },
    refetchOnWindowFocus: false,
  });

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (data) {
      setMovies(getRandomItems(data, 2));
    }
  }, [data]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const renderMovieCard = (movie: any, idx: number) => {
    const moviePath = "https://image.tmdb.org/t/p/w780" + movie.poster_path;
    return (
      <div
        key={idx}
        className="w-fit text-white flex flex-col divide-y-2 divide-gray-200 hover:divide-violet-500 items-center border-2 p-0.5 border-gray-200 hover:border-violet-500 hover:cursor-pointer rounded-xl"
      >
        <img
          src={moviePath}
          alt="Movie 1"
          className="rounded-t-lg"
          width={300}
          style={{
            objectFit: "contain",
          }}
        />
        <div className="w-full flex-1 py-4 items-center flex flex-col justify-center bg-gray-600 rounded-b-lg">
          <p className="text-lg tracking-wide truncate max-w-[300px]">
            {movie.title}
          </p>
        </div>
      </div>
    );
  };

  return (
    <BasePage>
      <div className="flex flex-col text-center justify-center items-center space-y-12 w-full max-w-4xl mx-auto py-8">
        <p className="text-white font-semibold text-2xl">
          Click on which movie you think is better! (2/10)
        </p>
        <div className="w-full flex flex-row gap-4 sm:gap-16 justify-center h-full">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>{movies.map((movie: any, idx) => renderMovieCard(movie, idx))}</>
          )}
        </div>
        <div>
          <button
            onClick={() => {
              setMovies(getRandomItems(data, 2));
            }}
            className="bg-green-500 hover:bg-green-700 px-4 py-2 text-white rounded-xl font-medium text-md"
          >
            Refresh
          </button>
        </div>
      </div>
    </BasePage>
  );
};

export default Quiz;
