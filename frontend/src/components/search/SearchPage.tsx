import styled from "styled-components";
import { FC, useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useSearchParams } from "react-router-dom";

import Grid from "../common/Grid";
import LoadingCircle from "../common/LoadingCircle";
import PropertyCard from "../property/PropertyCard";
import Typography from "../common/Typography";
import {
  fetchProperties,
  selectPropertiesArray,
  selectPropertyIds,
} from "../../store/properties";
import mapStyles from "./map-styles.json";
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

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDvPTRoAyW1GFS4jIw18N5k0WyMHdJPj-g",
  });

  const [map, setMap] = useState<google.maps.Map>();

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();

    properties.forEach((property) => {
      bounds.extend(
        new window.google.maps.LatLng(
          Number(property.lat),
          Number(property.lng)
        )
      );
    });
    map.fitBounds(bounds);

    const zoomLevel = map.getZoom() || 0;

    if (zoomLevel > 15) {
      map.setZoom(15);
    }
  }, [map, properties]);

  const { breakpointUp } = useViewWidth();

  return (
    <SearchPageRoot>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <Grid style={{ height: "100%", width: "100%" }}>
          {breakpointUp("md") && (
            <Grid item md={7}>
              {!isMapLoaded ? (
                <LoadingCircle />
              ) : (
                <GoogleMap
                  options={{
                    streetViewControl: false,
                    styles: mapStyles,
                  }}
                  mapContainerStyle={{
                    height: "100%",
                    width: "100%",
                  }}
                  zoom={10}
                  onLoad={onLoad}
                  onUnmount={() => setMap(undefined)}
                >
                  {properties.map((property) => (
                    <Marker
                      key={property.id}
                      position={{
                        lat: Number(property.lat),
                        lng: Number(property.lng),
                      }}
                      onClick={() =>
                        document
                          .querySelector(`#property-${property.id}`)
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    />
                  ))}
                </GoogleMap>
              )}
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
