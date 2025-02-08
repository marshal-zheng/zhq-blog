import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { GISCUS } from "@config";

export default function Comments() {
  const [theme, setTheme] = useState(() => {
    const currentTheme = localStorage.getItem("theme");
    const browserTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return currentTheme || browserTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="w-full mx-auto mt-8 lg:px-8">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4">
        <Giscus {...GISCUS} theme={theme} className="giscus-frame" />
      </div>
    </div>
  );
}
