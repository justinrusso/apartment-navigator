import { FC, useEffect, useState } from "react";
import styled from "styled-components";

import Container from "../common/Container";
import Grid from "../common/Grid";
import LoadingCircle from "../common/LoadingCircle";
import PropertyCard from "./PropertyCard";
import Typography from "../common/Typography";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  selectPropertyIds,
  fetchUserOwnedProperties,
} from "../../store/properties";

const SectionTitle = styled(Typography)`
  text-align: center;
`;

const Section = styled.section`
  padding: 2rem 0;
`;

const PropertiesManagementPage: FC = () => {
  const dispatch = useAppDispatch();
  const propertyIds = useAppSelector(selectPropertyIds());

  const [propertiesLoaded, setPropertiesLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchUserOwnedProperties()).then(() => setPropertiesLoaded(true));
  }, [dispatch]);

  return (
    <Section>
      <Container>
        <SectionTitle variant="h2" gutterBottom>
          Manage Your Properties
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
  );
};

export default PropertiesManagementPage;
