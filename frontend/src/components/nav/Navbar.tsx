import { FC } from "react";
import { useAuthModal } from "../../context/AuthModalProvider";
import Button from "../common/Button";

const Navbar: FC = () => {
  const authModal = useAuthModal();

  return (
    <div>
      <Button variant="text" onClick={authModal.showLogin}>
        Log In
      </Button>
      <Button variant="text" onClick={authModal.showSignup}>
        Sign Up
      </Button>
    </div>
  );
};

export default Navbar;
