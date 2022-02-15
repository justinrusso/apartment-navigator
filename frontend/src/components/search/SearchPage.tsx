import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Grid from "../common/Grid";
import LoadingCircle from "../common/LoadingCircle";
import PropertyCard from "../property/PropertyCard";
import PropertyMap from "../maps/PropertyMap";
import Typography from "../common/Typography";
import {
  fetchProperties,
  selectPropertiesArray,
  selectPropertyIds,
} from "../../store/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useViewWidth } from "../../hooks/view-width";

const SearchPageRoot = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
`;

const SearchPage: FC = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();

  const propertyIds = useAppSelector(selectPropertyIds());
  const properties = useAppSelector(selectPropertiesArray());

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchProperties({ searchParams })).then(() => setIsLoading(false));
  }, [dispatch, searchParams]);

  const { breakpointUp } = useViewWidth();

  return (
    <SearchPageRoot>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Grid style={{ height: "100%", width: "100%" }}>
          {breakpointUp("md") && (
            <Grid item md={7}>
              <PropertyMap enableMarkerClicks properties={properties} />
            </Grid>
          )}
          <Grid
            item
            md={5}
            style={{ height: "100%", overflow: "auto", padding: "1rem" }}
          >
            <Grid spacing="1.5rem">
              {propertyIds.length > 0 ? (
                propertyIds.map((propertyId) => (
                  <Grid item key={propertyId} id={`property-${propertyId}`}>
                    <PropertyCard propertyId={propertyId} elevation={4} wide />
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
          </Grid>
        </Grid>
      )}
    </SearchPageRoot>
  );
};

export default SearchPage;
