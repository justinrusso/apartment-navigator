import { createGlobalStyle, css, PaletteColor } from "styled-components";

/*
  Josh's Custom CSS Reset
  https://www.joshwcomeau.com/css/custom-css-reset/
*/
const resetCss = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  // https://www.joshwcomeau.com/css/custom-css-reset/#digit-tweaking-line-height
  * {
    line-height: calc(1em + 0.5rem);
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${resetCss}

  :root {
    --sans: 'Roboto','Helvetica','Arial',sans-serif;

    ${(props) => {
      const varMap: Record<string, string> = {};
      Object.entries(props.theme.palette).forEach(([paletteColor, palette]) => {
        if (typeof palette === "object" && (palette as PaletteColor).base) {
          varMap[`--palette-${paletteColor}-base`] = (
            palette as PaletteColor
          ).base!;
        }
      });
      return varMap;
    }}
  }

  body {
    ${(props) => props.theme.typography.body1}
    color: ${(props) => props.theme.palette.text.primary};
    background-color: ${(props) => props.theme.palette.background};
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.palette.text.secondary} ${(
  props
) => props.theme.palette.background};
  }
  *::-webkit-scrollbar {
    width: 16px;
  }
  *::-webkit-scrollbar-thumb {
    background-clip: content-box;
    background-color: ${(props) => props.theme.palette.text.secondary};
    border-radius: 8px;
    border: 4px solid transparent;
    height: 56px;

    &:hover {
      background-color: ${(props) => props.theme.palette.text.disabled};
    }
  }

  #root {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
`;

export default GlobalStyle;
