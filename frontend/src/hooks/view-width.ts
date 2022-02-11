import { useCallback, useEffect, useMemo, useState } from "react";
import { DefaultTheme, useTheme } from "styled-components";

type UseViewWidthHook = {
  breakpointUp: (key: keyof DefaultTheme["breakpoints"]["values"]) => boolean;
  value: keyof DefaultTheme["breakpoints"]["values"];
};

export function useViewWidth(): UseViewWidthHook {
  const [value, setValue] =
    useState<keyof DefaultTheme["breakpoints"]["values"]>("xs");

  const theme = useTheme();

  const breakpointValues = useMemo(
    () => Object.entries(theme.breakpoints.values).sort((a, b) => b[1] - a[1]),
    [theme]
  ) as [keyof DefaultTheme["breakpoints"]["values"], number][];

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      for (let i = 0; i < breakpointValues.length; i++) {
        const [key, val] = breakpointValues[i];

        // Since breakpointValues is sorted from highest to lowest,
        // the first match w here width > val is the correct one
        if (width > val) {
          setValue(key);
          return;
        }
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpointValues]);

  const breakpointUp = useCallback(
    (val: keyof DefaultTheme["breakpoints"]["values"]) => {
      const width = window.innerWidth;

      return width > theme.breakpoints.values[val];
    },
    [theme.breakpoints.values]
  );

  return {
    value,
    breakpointUp,
  };
}
