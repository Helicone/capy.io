import { SignOutButton } from "@clerk/nextjs";

interface BasePageProps {
  children: React.ReactNode;
}

const BasePage = (props: BasePageProps) => {
  const { children } = props;

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary divide-y divide-gray-500">
      <nav className="w-full py-4 px-8 flex flex-row items-center justify-between">
        <p className="text-white font-semibold text-2xl font-mono tracking-tight">
          Capybara Recs
        </p>
        <div className="bg-accent hover:bg-violet-700 px-4 py-2 text-white rounded-xl font-medium text-md">
          <SignOutButton />
        </div>
      </nav>
      <main className={`flex flex-col h-full w-full py-4 px-8 space-y-8`}>
        {children}
      </main>
    </div>
  );
};

export default BasePage;
