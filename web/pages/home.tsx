import { User } from "@clerk/nextjs/server";
import { useUser, SignOutButton } from "@clerk/nextjs";

interface HomeProps {
  user: User;
}

const Home = (props: HomeProps) => {
  //   const { user } = props;
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col items-center bg-primary divide-y divide-gray-500">
      <nav className="w-full p-4 flex flex-row items-center justify-between">
        <p className="text-white font-semibold text-2xl font-mono tracking-tight">
          Capybara Recs
        </p>
        <button className="bg-accent hover:bg-violet-700 px-4 py-2 text-white rounded-xl font-medium text-md">
          <SignOutButton />
        </button>
      </nav>
      <main className={`flex flex-col h-full w-full px-4 space-y-8`}>
        <p className="text-gray-400 font-semibold text-2xl py-8">
          Hello, <span className="text-white">{user.username}</span> welcome to
          Capybara Recs!
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="flex flex-col p-4 w-80 rounded-xl h-fit border border-gray-300 text-left space-y-4">
            <p className="text-white font-semibold text-2xl font-mono tracking-tight">
              Movie Quiz
            </p>
            <p className="text-gray-400 font-semibold text-md">
              Take a quiz to to build out your movie profile.
            </p>
            <div className="w-full flex justify-end">
              <p className="text-gray-200 text flex-end pt-8">{`< 2 minutes`}</p>
            </div>
          </button>
          <button className="flex flex-col p-4 w-80 rounded-xl h-fit border border-gray-300 text-left space-y-4">
            <p className="text-white font-semibold text-2xl font-mono tracking-tight">
              Recommendation w/ friend
            </p>
            <p className="text-gray-400 font-semibold text-md">
              Find a movie recommendation with a friend.
            </p>
            <div className="w-full flex justify-end">
              <p className="text-gray-200 text flex-end pt-8">{`< 2 minutes`}</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
