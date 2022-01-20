import { FC } from "react";

import Button from "../common/Button";
import { useAppDispatch } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { logoutUser } from "../../store/user";

const Navbar: FC = () => {
  const authModal = useAuthModal();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <div>
      <Button variant="text" onClick={authModal.showLogin}>
        Log In
      </Button>
      <Button variant="text" onClick={authModal.showSignup}>
        Sign Up
      </Button>
      <Button variant="text" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
};

export default Navbar;
