import "styled-components";

import { generateMediaQuery } from ".";

declare module "styled-components" {
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
    shadows: string[];
    transitions: {
      easing: {
        easeInOut: string;
        easeOut: string;
      };
    };
    zIndex: {
      modal: number;
    };
  }
}
