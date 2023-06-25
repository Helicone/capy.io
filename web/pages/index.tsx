import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();

  return (
    <main
      className={`flex flex-col sm:flex-row px-4 sm:px-16 gap-16 items-center justify-center align-center h-screen w-screen bg-primary`}
    >
      <div className="flex flex-col space-y-8">
        <h1 className="text-white font-semibold text-7xl font-mono">Capy.io</h1>
        <p className="text-gray-200 text-2xl tracking-wide max-w-xl leading-9">
          {user
            ? "Welcome back to Capybara Recs! Get perfect movie recommendations for you and your friends."
            : "Get perfect movie recommendations for you and your friends."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {user ? (
            <Link
              href="/home"
              className="bg-green-500 hover:bg-green-700 px-4 py-2 text-white rounded-xl font-medium text-lg"
            >
              Go to Homepage
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-accent hover:bg-violet-700 px-4 py-2 text-white rounded-xl font-medium text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/signin"
                className="bg-green-500 hover:bg-green-700 px-4 py-2 text-white rounded-xl font-medium text-lg"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
      <video
        width="540"
        height="360"
        controls
        autoPlay
        muted
        loop
        className="rounded-xl border border-white"
      >
        <source src="/assets/capy-waiting.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </main>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { userId } = getAuth(ctx.req);
//   if (userId) {
//     return {
//       redirect: {
//         destination: "/home",
//         permanent: false,
//       },
//     };
//   }
//   return { props: {} };
// };
