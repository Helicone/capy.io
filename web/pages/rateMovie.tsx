import { SignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function Signup() {
  const [rejectedMovieId, setRejectedMovieId] = useState<string>("");
  const [acceptedMovieId, setAcceptedMovieId] = useState<string>("");
  return (
    <div className="h-screen w-screen flex items-center justify-center align-center flex-col">
      Rate your movie
      <div>
        rejected movie id:
        <textarea
          className="border-2"
          onChange={(e) => setRejectedMovieId(e.target.value)}
        />
      </div>
      <div>
        accepted movie id:
        <textarea
          className="border-2"
          onChange={(e) => setAcceptedMovieId(e.target.value)}
        />
      </div>
      <button
        onClick={() => {
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
            alert("res" + JSON.stringify(res));
          });
        }}
        className="bg-green-500 hover:bg-green-700 px-4 py-2 text-white rounded-xl font-medium text-lg"
      >
        Rate
      </button>
    </div>
  );
}
