import { FC } from "react";
import { ThemeProvider } from "styled-components";

import AuthModals from "./auth/AuthModals";
import AuthModalProvider from "../context/AuthModalProvider";
import GlobalStyle from "../theme/GlobalStyle";
import Navbar from "./nav/Navbar";
import theme from "../theme";

const App: FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthModalProvider>
          <Navbar />
          <AuthModals />
        </AuthModalProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
