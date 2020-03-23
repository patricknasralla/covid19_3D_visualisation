import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import { lightTheme, darkTheme } from "./Theme";
import { LoadingSpinner } from "./Spinner";

export const App = () => {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    setLoadingText("Wrangling Pokemon");
    setTimeout(() => setLoadingText("Reticulating Splines"), 1500);
    const loadF = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(loadF);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <LoadingSpinner vCentered={true} loadingText={loadingText} />
      ) : (
        <div
          style={{
            width: "100vw",
            marginTop: "5rem",
            fontSize: "2rem",
            textAlign: "center"
          }}
        >
          App Loaded!
        </div>
      )}
    </ThemeProvider>
  );
};
