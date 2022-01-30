import fullLogo from "./full-logo.png";

import styled from "styled-components";
import { FC, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import Button from "../common/Button";
import Container from "../common/Container";
import Paper from "../common/Paper";
import ProfileButton from "./ProfileButton";
import SearchBar from "../search/SearchBar";
import { useAppSelector } from "../../hooks/redux";
import { useAuthModal } from "../../context/AuthModalProvider";
import { selectUser } from "../../store/user";
import { useOnScreen } from "../../hooks/on-screen";

// Used to determine when the navbar is not at the top of the screen
const NavbarSentinal = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

const NavbarRoot = styled(Paper)`
  position: sticky;
  transition: box-shadow 300ms
    ${(props) => props.theme.transitions.easing.easeInOut};
  top: 0;
  width: 100%;
  z-index: ${(props) => props.theme.zIndex.navbar};
`;

type NavbarInnerProps = { isHome?: boolean };
const NavbarInner = styled.div<NavbarInnerProps>`
  align-items: center;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: auto auto;
  min-height: 3.5rem;
  padding: 0.75rem 0;

  .search-bar-wrapper {
    grid-column: span 2;
    order: 1;

    ${(props) => props.theme.breakpoints.up("md", props.theme)} {
      grid-column: span 1;
      order: unset;
    }
  }

  & > * {
    display: flex;
    align-items: center;
  }

  .justify-end {
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

  ${(props) => props.theme.breakpoints.up("md", props.theme)} {
    ${(props) => !props.isHome && { gridTemplateColumns: "1fr auto 1fr" }}
    padding: 0;
  }
`;

const LogoWrapper = styled(Link)`
  height: 2.5rem;
  text-decoration: none;
`;

const Navbar: FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const authModal = useAuthModal();

  const user = useAppSelector(selectUser());

  const sentinalRef = useRef<HTMLDivElement | null>(null);

  const navbarStickied = !useOnScreen(sentinalRef, true);

  return (
    <>
      <NavbarSentinal ref={sentinalRef} />
      <NavbarRoot
        elevation={8}
        as="header"
        square
        style={{ boxShadow: navbarStickied ? undefined : "none" }}
      >
        <Container>
          <NavbarInner isHome={isHome}>
            <div>
              <LogoWrapper to="/">
                <img src={fullLogo} alt="apartment navigator" height="100%" />
              </LogoWrapper>
            </div>
            {!isHome && (
              <div className="search-bar-wrapper">
                <SearchBar />
              </div>
            )}
            <div className="justify-end">
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
    </>
  );
};

export default Navbar;
