import { FC, FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import Dialog from "../common/Dialog";
import InputField from "../common/InputField";
import { RegistrationErrors } from "../../api/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { registerUser, selectUser } from "../../store/user";

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

const SignupDialog: FC = () => {
  const authModal = useAuthModal();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser());

  useEffect(() => {
    if (user) {
      authModal.close();
    }
  }, [authModal, user]);

  const [errors, setErrors] = useState<
    RegistrationErrors & { confirmPassword?: string }
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
        registerUser({
          username,
          email,
          password,
          firstName,
          lastName,
          company,
        })
      ).unwrap();
      authModal.close();
    } catch (errors) {
      setErrors(errors as RegistrationErrors);
    }
  };

  return (
    <Dialog onClose={authModal.close}>
      <SignupDialogRoot>
        <h2>Create an account</h2>
        <p>or, sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <HalfWidthInputWrapper>
            <InputField
              label="First Name"
              fullWidth
              id="registration-first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              inputProps={{
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
              id="registration-last_name"
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
            id="registration-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{
              autoFocus: true,
              type: "text",
            }}
            error={!!errors.username}
            helperText={errors.username}
            required
          />
          <InputField
            label="Email"
            fullWidth
            id="registration-email"
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
              id="registration-password"
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
              id="registration-confirmation-password"
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
            id="registration-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            inputProps={{
              type: "text",
            }}
            error={!!errors.company}
            helperText={errors.company}
          />
          <button type="submit">Register</button>
        </form>
      </SignupDialogRoot>
    </Dialog>
  );
};

export default SignupDialog;
