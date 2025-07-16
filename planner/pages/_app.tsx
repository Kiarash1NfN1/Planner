import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="data-theme" enableSystem={false}>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
