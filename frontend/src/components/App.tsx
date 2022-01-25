import { FC, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import AuthModals from "./auth/AuthModals";
import AuthModalProvider from "../context/AuthModalProvider";
import GlobalStyle from "../theme/GlobalStyle";
import Navbar from "./nav/Navbar";
import PropertyPage from "./property/PropertyPage";
import RequireAuth from "./auth/RequireAuth";
import theme from "../theme";
import { authenticateUser } from "../store/user";
import { useAppDispatch } from "../hooks/redux";
import HomePage from "./home/HomePage";
import PropertyCreator from "./property/PropertyCreator";
import { fetchPropertyCategories } from "../store/properties";
import { fetchUnitCategories } from "../store/units";

const App: FC = () => {
  const dispatch = useAppDispatch();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void dispatch(authenticateUser()).then(() => setLoaded(true));
    void Promise.all([
      dispatch(fetchPropertyCategories()),
      dispatch(fetchUnitCategories()),
    ]);
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
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="properties">
                <Route
                  path="new"
                  element={
                    <RequireAuth>
                      <PropertyCreator />
                    </RequireAuth>
                  }
                />
                <Route path=":propertyId" element={<PropertyPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <AuthModals />
        </AuthModalProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
