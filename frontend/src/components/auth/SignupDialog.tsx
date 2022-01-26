import { FC, FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import AlternateAuthLink from "./AlternateAuthLink";
import Button from "../common/Button";
import Dialog from "../common/Dialog";
import InputField from "../common/InputField";
import { SignupErrors } from "../../api/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { signupUser, selectUser } from "../../store/user";

const HalfWidthInputWrapper = styled.div`
  ${(props) => props.theme.breakpoints.up("sm", props.theme)} {
    grid-column: span 6;
  }
`;

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

      &${HalfWidthInputWrapper} {
        ${(props) => props.theme.breakpoints.up("sm", props.theme)} {
          grid-column: span 6;
        }
      }
    }
  }
`;

interface SignupDialogProps {
  onSuccess?: () => void;
}

const SignupDialog: FC<SignupDialogProps> = ({ onSuccess }) => {
  const authModal = useAuthModal();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser());

  useEffect(() => {
    if (user) {
      authModal.close();
    }
  }, [authModal, user]);

  const [errors, setErrors] = useState<
    SignupErrors & { confirmPassword?: string }
  >({});

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({
        password: "Passwords do not match",
      });
      return;
    }

    try {
      await dispatch(
        signupUser({
          username,
          email,
          password,
          firstName,
          lastName,
          company,
        })
      ).unwrap();
      authModal.close();
      onSuccess?.();
    } catch (errors) {
      setErrors(errors as SignupErrors);
    }
  };

  return (
    <Dialog onClose={authModal.close} open>
      <SignupDialogRoot>
        <h2>Create an account</h2>
        <p>
          or,{" "}
          <AlternateAuthLink onClick={authModal.switchForms}>
            log in to your account
          </AlternateAuthLink>
        </p>
        <form onSubmit={handleSubmit}>
          <HalfWidthInputWrapper>
            <InputField
              label="First Name"
              fullWidth
              id="signup-first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              inputProps={{
                autoFocus: true,
                type: "text",
              }}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />
          </HalfWidthInputWrapper>
          <HalfWidthInputWrapper>
            <InputField
              label="Last Name"
              fullWidth
              id="signup-last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              inputProps={{
                type: "text",
              }}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />
          </HalfWidthInputWrapper>
          <InputField
            label="Username"
            fullWidth
            id="signup-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{
              type: "text",
            }}
            error={!!errors.username}
            helperText={errors.username}
            required
          />
          <InputField
            label="Email"
            fullWidth
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{
              type: "text",
            }}
            error={!!errors.email}
            helperText={errors.email}
            required
          />

          <HalfWidthInputWrapper>
            <InputField
              label="Password"
              fullWidth
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{
                type: "password",
              }}
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </HalfWidthInputWrapper>
          <HalfWidthInputWrapper>
            <InputField
              label="Confirm Password"
              fullWidth
              id="signup-confirmation-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputProps={{
                type: "password",
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
            />
          </HalfWidthInputWrapper>

          <InputField
            label="Company"
            fullWidth
            id="signup-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            inputProps={{
              type: "text",
            }}
            error={!!errors.company}
            helperText={errors.company}
          />
          <Button type="submit">Sign Up</Button>
        </form>
      </SignupDialogRoot>
    </Dialog>
  );
};

export default SignupDialog;
