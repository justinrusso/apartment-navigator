import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "../common/Container";
import Grid from "../common/Grid";
import LoadingCircle from "../common/LoadingCircle";
import PropertyCard from "../property/PropertyCard";
import styled from "styled-components";
import Typography from "../common/Typography";
import { fetchProperties, selectPropertyIds } from "../../store/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const SearchPageRoot = styled.div`
  padding: 2rem 0;
`;

const SearchPage: FC = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();

  const propertyIds = useAppSelector(selectPropertyIds());

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchProperties({ searchParams })).then(() => setIsLoading(false));
  }, [dispatch, searchParams]);

  return (
    <SearchPageRoot>
      <Container>
        {isLoading ? (
          <LoadingCircle />
        ) : (
          <Grid spacing="1.5rem">
            {propertyIds.length > 0 ? (
              propertyIds.map((propertyId) => (
                <Grid item md={6} lg={4} key={propertyId}>
                  <PropertyCard propertyId={propertyId} elevation={4} />
                </Grid>
              ))
            ) : (
              <Grid item>
                <Typography>
                  No properties found for "{searchParams.get("key") || ""}"
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </SearchPageRoot>
  );
};

export default SearchPage;
