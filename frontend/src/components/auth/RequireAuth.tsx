import { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthModal } from "../../context/AuthModalProvider";
import { useAppSelector } from "../../hooks/redux";
import { selectUser } from "../../store/user";

const RequireAuth: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const authModal = useAuthModal();
  const location = useLocation();
  const user = useAppSelector(selectUser());

  if (user) {
    return <>{children}</>;
  }

  authModal.showLogin();
  return <Navigate to="/" replace state={{ from: location }} />;
};

export default RequireAuth;
