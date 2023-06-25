import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
