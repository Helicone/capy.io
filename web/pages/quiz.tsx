/* eslint-disable @next/next/no-img-element */
import BasePage from "@/components/basePage";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DiscoverMovieDiscoverResult } from "tmdb-js-node";
import { MovieRatingResponse } from "./api/movieRating";

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

  const { data: topMovies, isLoading: isTopMoviesLoading } = useQuery({
    queryKey: ["top-movies"],
    queryFn: async () => {
      const resp = await fetch("/api/top-movies", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return resp.json() as Promise<DiscoverMovieDiscoverResult[]>;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: myList,
    isLoading: isMyListLoading,
    refetch: refetchMyList,
  } = useQuery({
    queryKey: ["getMovieRating"],
    queryFn: async () => {
      console.log("getting movie ratings");
      const resp = await fetch("/api/movieRating", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("got movie ratings");

      const x = (await resp.json()) as Promise<MovieRatingResponse>;
      console.log("x", x);
      return x;
    },
    refetchOnWindowFocus: false,
  });

  const [numberOfMoviesRated, setNumberOfMoviesRated] = useState<number>(0);
  useEffect(() => {
    if (myList?.ratings) {
      setNumberOfMoviesRated(myList?.ratings?.length);
    }
  }, [myList?.ratings]);

  const [movies, setMovies] = useState<DiscoverMovieDiscoverResult[]>([]);

  useEffect(() => {
    if (topMovies) {
      setMovies(getRandomItems(topMovies, 2));
    }
  }, [topMovies]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const onMovieSelect = (movie: DiscoverMovieDiscoverResult) => {
    const acceptedMovieId = movie.id;
    const rejectedMovieId = movies.filter((m) => m.id !== movie.id)[0].id;
    fetch("/api/movieRating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rejectedMovieImbdId: rejectedMovieId,
        acceptedMovieImbdId: acceptedMovieId,
      }),
    }).then((res) => {
      // alert("res" + JSON.stringify(res));
    });
    setMovies(getRandomItems(topMovies!, 2));
    setNumberOfMoviesRated(numberOfMoviesRated + 1);
  };

  const renderMovieCard = (movie: DiscoverMovieDiscoverResult, idx: number) => {
    const moviePath = "https://image.tmdb.org/t/p/w780" + movie.poster_path;
    return (
      <button
        key={idx}
        className="w-fit text-white flex flex-col divide-y-2 divide-gray-200 hover:divide-violet-500 items-center border-2 p-0.5 border-gray-200 hover:border-violet-500 hover:cursor-pointer rounded-xl"
        onClick={() => onMovieSelect(movie)}
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
      </button>
    );
  };

  const LIMIT = 20;

  return (
    <BasePage>
      <div className="w-full justify-start text-white">
        <Link href="/home">{`<- Home`}</Link>
      </div>
      <div className="flex flex-col text-center justify-center items-center space-y-12 w-full max-w-4xl mx-auto py-8">
        <p className="text-white font-semibold text-2xl">
          Click on which movie you think is better! ({numberOfMoviesRated + 1}/{" "}
          {LIMIT})
        </p>

        {numberOfMoviesRated > LIMIT ? (
          <div className="border border-gray-200 border-dashed p-8 rounded-xl text-white text-xl w-[450px]">
            You&apos;re all set with the quiz. Go to the recs page to find a
            friend to watch a movie with!
          </div>
        ) : (
          <div className="w-full flex flex-row gap-4 sm:gap-16 justify-center h-full">
            {isTopMoviesLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {movies.map((movie: DiscoverMovieDiscoverResult, idx) =>
                  renderMovieCard(movie, idx)
                )}
              </>
            )}
          </div>
        )}

        <div>
          <button
            onClick={() => {
              setMovies(getRandomItems(topMovies || [], 2));
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
