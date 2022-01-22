import HeroBackground from "./hero-background.jfif";

import Container from "../common/Container";
import Grid from "../common/Grid";
import LoadingCircle from "../common/LoadingCircle";
import styled from "styled-components";
import Typography from "../common/Typography";
import { FC, useEffect, useState } from "react";
import { fetchProperties, selectPropertyIds } from "../../store/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import PropertyCard from "../property/PropertyCard";

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

const SectionTitle = styled(Typography)`
  text-align: center;
`;

const Section = styled.section`
  padding: 2rem 0;
`;

const HomePage: FC = () => {
  const dispatch = useAppDispatch();
  const propertyIds = useAppSelector(selectPropertyIds());

  const [propertiesLoaded, setPropertiesLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties()).then(() => setPropertiesLoaded(true));
  }, [dispatch]);

  return (
    <>
      <HeroSection>
        <div className="hero-content-wrapper">
          <Container>
            <Typography variant="h2" gutterBottom color="inherit">
              Discover Your New Apartment
            </Typography>
          </Container>
        </div>
        <div className="hero-background" />
        <div className="hero-background-overlay" />
      </HeroSection>
      <Section>
        <Container>
          <SectionTitle variant="h2" gutterBottom>
            Properties For Rent Near You
          </SectionTitle>
          {propertiesLoaded ? (
            <Grid spacing="1.5rem">
              {propertyIds.map((propertyId) => (
                <Grid item md={6} lg={4} key={propertyId}>
                  <PropertyCard propertyId={propertyId} elevation={4} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <LoadingCircle />
          )}
        </Container>
      </Section>
    </>
  );
};

export default HomePage;
