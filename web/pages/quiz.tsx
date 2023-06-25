/* eslint-disable @next/next/no-img-element */
import BasePage from "@/components/basePage";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

interface QuizProps {}

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
      return resp;
    },
    refetchOnWindowFocus: false,
  });

  console.log(data);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <BasePage>
      <div className="flex flex-col text-center justify-center items-center space-y-8 w-full max-w-4xl mx-auto">
        <p className="text-white font-semibold text-2xl py-8">
          Click on which movie you think is better! (2/10)
        </p>
        <div className="w-full flex flex-row gap-8 h-full">
          <div className="w-[50%] text-white flex flex-col divide-y-2 divide-gray-200 hover:divide-violet-500 items-center border-2 p-0.5 border-gray-200 hover:border-violet-500 hover:cursor-pointer rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt="Movie 1"
              className="rounded-t-lg"
              style={{
                objectFit: "cover",
              }}
            />
            <div className="w-full flex-1 py-4 items-center flex flex-col justify-center bg-gray-600 rounded-b-lg">
              <p className=" text-lg tracking-wide">Image Title</p>
            </div>
          </div>
          <div className="w-[50%] text-white flex flex-col divide-y-2 divide-gray-200 hover:divide-violet-500 items-center border-2 p-0.5 border-gray-200 hover:border-violet-500 hover:cursor-pointer rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt="Movie 1"
              className="rounded-t-lg"
              style={{
                objectFit: "cover",
              }}
            />
            <div className="w-full flex-1 py-4 items-center flex flex-col justify-center bg-gray-600 rounded-b-lg">
              <p className="text-lg tracking-wide">Image Title</p>
            </div>
          </div>
        </div>
        <div>
          <button className="bg-green-500 hover:bg-green-700 px-4 py-2 text-white rounded-xl font-medium text-md">
            Refresh
          </button>
        </div>
      </div>
    </BasePage>
  );
};

export default Quiz;
