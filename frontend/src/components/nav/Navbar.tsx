import { FC } from "react";
import { useAuthModal } from "../../context/AuthModalProvider";

const Navbar: FC = () => {
  const authModal = useAuthModal();

  return (
    <div>
      <button onClick={authModal.showLogin}>Log In</button>
      <button onClick={authModal.showSignup}>Sign Up</button>
    </div>
  );
};

export default Navbar;
