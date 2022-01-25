import styled from "styled-components";
import { FC } from "react";
import { Link } from "react-router-dom";

import Paper, { PaperProps } from "../common/Paper";
import Typography from "../common/Typography";
import { createAddress } from "./utils";
import { selectProperty, selectPropertyImage } from "../../store/properties";
import { useAppSelector } from "../../hooks/redux";

const CardRoot = styled(Paper)`
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const CardHoverOverlay = styled.div`
  background-color: currentcolor;
  border-radius: inherit;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  transition: ${(props) =>
    `opacity 250ms ${props.theme.transitions.easing.easeInOut} 0ms`};
`;

const CardLinkWrapper = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:hover {
    ${CardHoverOverlay} {
      opacity: ${(props) => props.theme.palette.action.hoverOpacity};
    }
  }
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
    <CardLinkWrapper to={`/properties/${propertyId}`}>
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
        <CardHoverOverlay />
      </CardRoot>
    </CardLinkWrapper>
  );
};

export default PropertyCard;
