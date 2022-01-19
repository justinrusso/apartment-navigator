import { FC } from "react";
import { useAuthModal } from "../../context/AuthModalProvider";

const Navbar: FC = () => {
  const authModal = useAuthModal();

  return (
    <div>
      <button onClick={authModal.showLogin}>Sign In</button>
      <button onClick={authModal.showSignup}>Register</button>
    </div>
  );
};

export default Navbar;
