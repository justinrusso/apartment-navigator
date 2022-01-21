import { FC } from "react";

import Button from "../common/Button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { logoutUser, selectUser } from "../../store/user";
import { Link } from "react-router-dom";

const Navbar: FC = () => {
  const authModal = useAuthModal();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser());

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <div>
      {!user && (
        <>
          <Button variant="text" onClick={authModal.showLogin}>
            Log In
          </Button>
          <Button variant="text" onClick={authModal.showSignup}>
            Sign Up
          </Button>
        </>
      )}
      {user && (
        <Button variant="text" onClick={handleLogout}>
          Log out
        </Button>
      )}
      {user && (
        <Button variant="text" as={Link} to="/properties/new">
          Add a Property
        </Button>
      )}
    </div>
  );
};

export default Navbar;
