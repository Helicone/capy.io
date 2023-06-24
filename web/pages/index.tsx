import Link from "next/link";

export default function Home() {
  return (
    <main
      className={`flex flex-col sm:flex-row px-4 sm:px-16 gap-16 items-center justify-center align-center h-screen w-screen bg-primary`}
    >
      <div className="flex flex-col space-y-8">
        <h1 className="text-white font-semibold text-7xl font-mono">Capy.io</h1>
        <p className="text-gray-200 text-2xl tracking-wide">
          Get perfect movie recommendations for you and your friends.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="bg-accent hover:bg-violet-700 px-4 py-2 text-white rounded-xl font-medium text-lg"
          >
            Get Started
          </Link>
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
