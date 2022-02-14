import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { FC, useCallback, useEffect, useState } from "react";

import LoadingCircle from "../common/LoadingCircle";
import mapStyles from "./propertyMapStyles.json";
import { NormalizedProperty } from "../../store/normalizers/properties";

type PropertyMapProps = {
  properties: NormalizedProperty[];
};

const PropertyMap: FC<PropertyMapProps> = ({ properties }) => {
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
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

  return !isMapLoaded ? (
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
  );
};

export default PropertyMap;
