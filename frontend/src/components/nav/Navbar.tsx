import fullLogo from "./full-logo.png";

import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Button from "../common/Button";
import Container from "../common/Container";
import Paper from "../common/Paper";
import ProfileButton from "./ProfileButton";
import { useAppSelector } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { selectUser } from "../../store/user";

const NavbarRoot = styled(Paper)`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.navbar};
`;

const NavbarInner = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  min-height: 3.5rem;

  & > * {
    display: flex;
    align-items: center;
  }

  & > *:nth-child(3n) {
    justify-self: end;
  }

  ${(props) =>
    props.theme.breakpoints.up(
      "xs",
      props.theme
    )} and (orientation: landscape) {
    min-height: 3rem;
  }

  ${(props) => props.theme.breakpoints.up("sm", props.theme)} {
    min-height: 4rem;
  }
`;

const LogoWrapper = styled(Link)`
  height: 2.5rem;
  text-decoration: none;
`;

const Navbar: FC = () => {
  const authModal = useAuthModal();

  const user = useAppSelector(selectUser());

  return (
    <NavbarRoot elevation={8} as="header" square>
      <Container>
        <NavbarInner>
          <div>
            <LogoWrapper to="/">
              <img src={fullLogo} alt="apartment navigator" height="100%" />
            </LogoWrapper>
          </div>
          <div></div>
          <div>
            {!user && (
              <>
                <Button variant="text" onClick={authModal.showLogin}>
                  Log In
                </Button>
                <Button variant="text" onClick={authModal.showSignup}>
                  Sign Up
                </Button>
              </>
            )}
            {user && (
              <>
                <Button variant="text" as={Link} to="/properties/new">
                  Add a Property
                </Button>
                <ProfileButton />
              </>
            )}
          </div>
        </NavbarInner>
      </Container>
    </NavbarRoot>
  );
};

export default Navbar;
