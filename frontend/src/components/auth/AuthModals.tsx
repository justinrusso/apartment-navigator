import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoginDialog from "./LoginDialog";
import SignupDialog from "./SignupDialog";
import { useAuthModal } from "../../context/AuthModalProvider";

type LocationState =
  | {
      from?: { pathname: string };
    }
  | undefined;

const AuthModals: FC = () => {
  const authModal = useAuthModal();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSuccess = () => {
    const from = (location.state as LocationState)?.from?.pathname || "/";
    navigate(from, { replace: true });
  };

  return (
    <>
      {authModal.loginModalVisible && <LoginDialog onSuccess={handleSuccess} />}
      {authModal.signupModalVisible && (
        <SignupDialog onSuccess={handleSuccess} />
      )}
    </>
  );
};

export default AuthModals;
