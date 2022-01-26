import { Navigate, useLocation } from "react-router-dom";
import { useAuthModal } from "../../context/AuthModalProvider";
import { selectUser } from "../../store/user";
import { useAppSelector } from "../../hooks/redux";
import { FC, PropsWithChildren } from "react";

interface RequireUserProps {
  redirectTo?: string;
  userId: number;
}

const RequireUser: FC<PropsWithChildren<RequireUserProps>> = ({
  children,
  redirectTo,
  userId,
}) => {
  const authModal = useAuthModal();
  const location = useLocation();
  const user = useAppSelector(selectUser());

  if (!user) {
    authModal.showLogin();
    return (
      <Navigate to={redirectTo || "/"} replace state={{ from: location }} />
    );
  }

  if (user.id !== userId) {
    return (
      <Navigate to={redirectTo || "/"} replace state={{ from: location }} />
    );
  }

  return <>{children}</>;
};

export default RequireUser;
