import { FC } from "react";
import { useAuthModal } from "../../context/AuthModalProvider";
import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";

const AuthModals: FC = () => {
  const authModal = useAuthModal();
  return (
    <>
      {authModal.loginModalVisible && <LoginDialog />}
      {authModal.signupModalVisible && <SignupDialog />}
    </>
  );
};

export default AuthModals;
