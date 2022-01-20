import HeroBackground from "./hero-background.jfif";

import { FC } from "react";
import styled from "styled-components";
import Container from "../common/Container";

const HeroSection = styled.section`
  height: 55vmin;
  background-color: black;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .hero-content-wrapper {
    z-index: 10;
    color: #fff;
  }

  .hero-background {
    background-image: url(${HeroBackground});
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: cover;
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .hero-background-overlay {
    background: rgba(0, 0, 0, 0.5);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const HomePage: FC = () => {
  return (
    <>
      <HeroSection>
        <div className="hero-content-wrapper">
          <Container>
            <h1>Discover Your New Apartment</h1>
          </Container>
        </div>
        <div className="hero-background" />
        <div className="hero-background-overlay" />
      </HeroSection>
    </>
  );
};

export default HomePage;
