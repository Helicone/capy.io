import BasePage from "@/components/basePage";
import LoadingAnimation from "@/components/loadingAnimation";

interface RecsProps {}

const Recs = (props: RecsProps) => {
  const {} = props;

  return (
    <BasePage>
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
          <div className="mt-2">
            <input
              type="text"
              name="username"
              id="username"
              className="block w-full max-w-[350px] rounded-md border-0 py-3 px-4 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:leading-6"
              placeholder="Your friend's username"
            />
          </div>
        </div>
      </div>
      <LoadingAnimation
        title={"Building your recommendation with your friend"}
      />
    </BasePage>
  );
};

export default Recs;
