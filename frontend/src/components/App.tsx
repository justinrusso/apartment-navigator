import { FC } from "react";
import AuthModalProvider from "../context/AuthModalProvider";
import Navbar from "./nav/Navbar";

const App: FC = () => {
  return (
    <>
      <AuthModalProvider>
        <Navbar />
      </AuthModalProvider>
    </>
  );
};

export default App;
