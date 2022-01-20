import { FC, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import AuthModals from "./auth/AuthModals";
import AuthModalProvider from "../context/AuthModalProvider";
import GlobalStyle from "../theme/GlobalStyle";
import Navbar from "./nav/Navbar";
import theme from "../theme";
import { authenticateUser } from "../store/user";
import { useAppDispatch } from "../hooks/redux";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./home/HomePage";

const App: FC = () => {
  const dispatch = useAppDispatch();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void dispatch(authenticateUser()).then(() => setLoaded(true));
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthModalProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <AuthModals />
        </AuthModalProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
