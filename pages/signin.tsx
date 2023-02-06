import Head from "next/head";
import { Inter } from "@next/font/google";
import { useState } from "react";

import { Alert, ThemeProvider } from "@mui/material";
import { theme } from "@/shared/theme";
import LogIn from "@/components/login";

const inter = Inter({ subsets: ["latin"] });

export default function SignIn() {
  const [error, setError] = useState("");
  const [dismissError, setDismissError] = useState(false);

  function handleSetError(error: string) {
    setDismissError(false);
    setError(error);
  }

  const handleDismissError = () => {
    setDismissError(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Film Helper</title>
        <meta
          name="description"
          content="Web app to help organise your watchlist"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col bg-slate-300 h-[100vh] overflow-hidden">
        {error && !dismissError && (
          <Alert severity="error" onClose={handleDismissError}>
            {`Error: ${error}`}
          </Alert>
        )}
        <LogIn setError={handleSetError} />
      </div>
    </ThemeProvider>
  );
}
