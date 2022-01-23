import styled from "styled-components";
import { FC } from "react";

import Paper, { PaperProps } from "../common/Paper";
import { createAddress } from "./utils";
import { selectProperty, selectPropertyImage } from "../../store/properties";
import { useAppSelector } from "../../hooks/redux";
import Typography from "../common/Typography";

const CardRoot = styled(Paper)`
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const CardMedia = styled.div`
  width: 100%;
  padding-top: 62.5%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

interface PropertyCardProps extends PaperProps {
  propertyId: number;
}

const PropertyCard: FC<PropertyCardProps> = ({ propertyId, ...paperProps }) => {
  const property = useAppSelector(selectProperty(propertyId));
  const propertyImage = useAppSelector(
    selectPropertyImage(property?.images[0])
  );

  if (!property) {
    return null;
  }

  return (
    <CardRoot {...paperProps}>
      {propertyImage && (
        <CardMedia style={{ backgroundImage: `url(${propertyImage.url})` }} />
      )}
      <CardContent>
        <Typography as="h3" variant="h4" gutterBottom>
          {property.name || property.address1}
        </Typography>
        <Typography>{createAddress(property)}</Typography>
      </CardContent>
    </CardRoot>
  );
};

export default PropertyCard;
