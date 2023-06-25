import { buildClerkProps, getAuth, User } from "@clerk/nextjs/server";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { GetServerSideProps } from "next";
import Link from "next/link";
import BasePage from "@/components/basePage";

interface HomeProps {
  user: User;
}

const Home = (props: HomeProps) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <BasePage>
      <p className="text-gray-400 font-semibold text-2xl py-8">
        Hello, <span className="text-white">{user.username}</span> welcome to
        Capybara Recs!
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/quiz"
          className="flex flex-col p-4 w-80 rounded-xl h-fit border border-gray-300 text-left space-y-4 hover:bg-gray-700"
        >
          <p className="text-white font-semibold text-2xl font-mono tracking-tight">
            Movie Quiz
          </p>
          <p className="text-gray-400 font-semibold text-md">
            Take a quiz to to build out your movie profile.
          </p>
          <div className="w-full flex justify-end">
            <p className="text-gray-200 text flex-end pt-8">{`< 2 minutes`}</p>
          </div>
        </Link>
        <Link
          href="/recs"
          className="flex flex-col p-4 w-80 rounded-xl h-fit border border-gray-300 text-left space-y-4 hover:bg-gray-700"
        >
          <p className="text-white font-semibold text-2xl font-mono tracking-tight">
            Recommendation w/ friend
          </p>
          <p className="text-gray-400 font-semibold text-md">
            Find a movie recommendation with a friend.
          </p>
          <div className="w-full flex justify-end">
            <p className="text-gray-200 text flex-end pt-8">{`< 2 minutes`}</p>
          </div>
        </Link>
      </div>
    </BasePage>
  );
};

export default Home;
