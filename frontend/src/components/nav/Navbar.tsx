import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Button from "../common/Button";
import Container from "../common/Container";
import Paper from "../common/Paper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { logoutUser, selectUser } from "../../store/user";

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
  text-decoration: none;
  color: green; // TODO: Use palette primary color
`;

const Navbar: FC = () => {
  const authModal = useAuthModal();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser());

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <NavbarRoot elevation={8} as="header" square>
      <Container>
        <NavbarInner>
          <div>
            <LogoWrapper to="/">Apartment Navigator</LogoWrapper>
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
              <Button variant="text" onClick={handleLogout}>
                Log out
              </Button>
            )}
            {user && (
              <Button variant="text" as={Link} to="/properties/new">
                Add a Property
              </Button>
            )}
          </div>
        </NavbarInner>
      </Container>
    </NavbarRoot>
  );
};

export default Navbar;
