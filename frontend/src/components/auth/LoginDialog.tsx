import { FC, FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import Dialog from "../common/Dialog";
import InputField from "../common/InputField";
import { LoginErrors } from "../../api/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { loginUser, selectUser } from "../../store/user";

const SignupDialogRoot = styled.div`
  display: flex;
  flex: 1 1 auto;
  gap: 1.375rem;
  overflow-y: auto;
  padding: 20px 24px;
  flex-direction: column;

  form {
    display: grid;
    gap: 1.25rem 1rem;
    grid-template-columns: repeat(12, 1fr);

    > * {
      grid-column: span 12;
    }
  }
`;

const SignupDialog: FC = () => {
  const authModal = useAuthModal();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser());

  useEffect(() => {
    if (user) {
      authModal.close();
    }
  }, [authModal, user]);

  const [errors, setErrors] = useState<LoginErrors>({});

  const [credentials, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(
        loginUser({
          credentials,
          password,
        })
      ).unwrap();
      authModal.close();
    } catch (errors) {
      setErrors(errors as LoginErrors);
    }
  };

  return (
    <Dialog onClose={authModal.close}>
      <SignupDialogRoot>
        <h2>Log in to your account</h2>
        <p>or, create an account</p>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email or Username"
            fullWidth
            id="login-credentials"
            value={credentials}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{
              autoFocus: true,
              type: "text",
            }}
            error={!!errors.credentials || !!errors.invalid}
            helperText={errors.credentials}
            required
          />
          <InputField
            label="Password"
            fullWidth
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{
              type: "password",
            }}
            error={!!errors.password || !!errors.invalid}
            helperText={errors.password || errors.invalid}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </SignupDialogRoot>
    </Dialog>
  );
};

export default SignupDialog;
