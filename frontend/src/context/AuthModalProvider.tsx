import {
  FC,
  PropsWithChildren,
  createContext,
  useState,
  useContext,
} from "react";

interface AuthModalContextValue {
  close: () => void;
  hideLogin: () => void;
  hideSignup: () => void;
  loginModalVisible: boolean;
  showLogin: () => void;
  showSignup: () => void;
  signupModalVisible: boolean;
  switchForms: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue>(
  {} as AuthModalContextValue
);

export const useAuthModal = () => useContext(AuthModalContext);

const AuthModalProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);

  const switchForms = () => {
    setLoginModalVisible((prev) => !prev);
    setSignupModalVisible((prev) => !prev);
  };

  return (
    <AuthModalContext.Provider
      value={{
        close: () => {
          setLoginModalVisible(false);
          setSignupModalVisible(false);
        },
        hideLogin: () => setLoginModalVisible(false),
        hideSignup: () => setSignupModalVisible(false),
        loginModalVisible,
        showLogin: () => setLoginModalVisible(true),
        showSignup: () => setSignupModalVisible(true),
        signupModalVisible,
        switchForms,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export default AuthModalProvider;
