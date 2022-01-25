import "styled-components";

import { generateMediaQuery } from ".";

declare module "styled-components" {
  type PaletteColor = {
    base: string;
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };

  type TypographyEntry = {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    letterSpacing: string;
  };

  export interface DefaultTheme {
    borderRadius: number;
    breakpoints: {
      down: ReturnType<typeof generateMediaQuery>;
      up: ReturnType<typeof generateMediaQuery>;
      values: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
    };
    palette: {
      primary: PaletteColor;
      error: PaletteColor;
      action: {
        hoverOpacity: number;
        disabledOpacity: number;
      };
      text: {
        base: string;
        primary: string;
        secondary: string;
        disabled: string;
      };
      divider: string;
    };
    shadows: string[];
    transitions: {
      easing: {
        easeInOut: string;
        easeOut: string;
      };
    };
    typography: {
      h1: TypographyEntry;
      h2: TypographyEntry;
      h3: TypographyEntry;
      h4: TypographyEntry;
      body1: TypographyEntry;
      button: TypographyEntry;
    };
    zIndex: {
      navbar: number;
      modal: number;
    };
  }
}
