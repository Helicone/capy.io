import BasePage from "@/components/basePage";
import LoadingAnimation from "@/components/loadingAnimation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { CapyRecResponse } from "./api/capyRec";

interface RecsProps {}

const Recs = (props: RecsProps) => {
  const {} = props;

  const [friend, setFriend] = useState<string>();

  const { data, mutate, isLoading } = useMutation({
    mutationKey: ["getRecommendation"],
    mutationFn: async (usernames: string[]) => {
      const resp = await fetch("/api/capyRec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: usernames,
        }),
      });
      return resp.json() as Promise<CapyRecResponse>;
    },
  });

  return (
    <BasePage>
      <div className="w-full justify-start text-white">
        <Link href="/home">{`<- Home`}</Link>
      </div>
      <div className="py-8 flex flex-col space-y-8">
        <p className="text-gray-200 font-semibold text-2xl">
          Enter in a friend&apos;s username to find a movie recommendation
        </p>
        <div>
          <label
            htmlFor="username"
            className="block text-md font-medium leading-6 text-white"
          >
            Username
          </label>
          <div className="mt-2 flex flex-row gap-4">
            <input
              type="text"
              name="username"
              id="username"
              className="block w-full max-w-[350px] rounded-lg border-0 py-3 px-4 text-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:leading-6"
              placeholder="Your friend's username"
              value={friend}
              onChange={(e) => {
                setFriend(e.target.value);
              }}
            />
            <button
              onClick={() => {
                if (!friend) {
                  alert("Please enter a username");
                  return;
                }
                mutate([friend]);
              }}
              className="bg-green-500 hover:bg-green-700 px-4 py-2 text-white rounded-lg font-medium text-md"
            >
              Find a movie
            </button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <LoadingAnimation title={"Building your movie recommendation"} />
      ) : (
        <div className="flex flex-col space-y-8">{JSON.stringify(data)}</div>
      )}
    </BasePage>
  );
};

export default Recs;
