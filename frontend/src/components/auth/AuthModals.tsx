import { FC } from "react";
import { useAuthModal } from "../../context/AuthModalProvider";
import SignupDialog from "./SignupDialog";

const AuthModals: FC = () => {
  const authModal = useAuthModal();
  return <>{authModal.signupModalVisible && <SignupDialog />}</>;
};

export default AuthModals;
