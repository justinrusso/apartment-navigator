import placeholderImage from "./property-placeholder.jpg";

import styled from "styled-components";
import { FC, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../common/Button";
import Paper, { PaperProps } from "../common/Paper";
import PropertyDeleteDialog from "./dialogs/PropertyDeleteDialog";
import Typography from "../common/Typography";
import { createAddress } from "./utils";
import { selectProperty, selectPropertyImage } from "../../store/properties";
import { useAppSelector } from "../../hooks/redux";

const CardRoot = styled(Paper)`
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;

  .delete-button {
    position: absolute;
    top: 8px;
    right: 8px;
  }
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
  position: relative;
  display: block;
  text-decoration: none;

  &:hover {
    ${CardHoverOverlay} {
      opacity: ${(props) => props.theme.palette.action.hoverOpacity};
    }
  }
`;

type CardMediaProps = { wide?: boolean };
const CardMedia = styled.div<CardMediaProps>`
  width: 100%;
  padding-top: ${(props) => (props.wide ? "200px" : "62.5%")};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardActions = styled.div`
  align-items: center;
  display: flex;
  padding: 0.5rem;
`;

interface PropertyCardProps extends PaperProps {
  propertyId: number;
  showActions?: boolean;
  to?: string;
  wide?: boolean;
}

const PropertyCard: FC<PropertyCardProps> = ({
  propertyId,
  showActions,
  to,
  wide,
  ...paperProps
}) => {
  const property = useAppSelector(selectProperty(propertyId));
  const propertyImage = useAppSelector(
    selectPropertyImage(property?.images[0])
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!property) {
    return null;
  }

  const propertyName = property.name || property.address1;

  return (
    <>
      <CardRoot {...paperProps}>
        <CardLinkWrapper to={to || `/properties/${propertyId}`}>
          <CardMedia
            wide={wide}
            style={{
              backgroundImage: `url(${propertyImage?.url || placeholderImage})`,
            }}
          />
          <CardContent>
            <Typography as="h3" variant="h4" gutterBottom>
              {propertyName}
            </Typography>
            <Typography>{createAddress(property)}</Typography>
          </CardContent>
          <CardHoverOverlay />
        </CardLinkWrapper>
        {showActions && (
          <CardActions>
            <Button variant="text" as={Link} to={`/properties/${propertyId}`}>
              View
            </Button>
            <Button
              variant="text"
              as={Link}
              to={`/properties/${propertyId}/edit`}
            >
              Edit
            </Button>
            <Button
              variant="text"
              color="error"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </CardActions>
        )}
      </CardRoot>
      {showActions && showDeleteModal && (
        <PropertyDeleteDialog
          open
          onClose={() => setShowDeleteModal(false)}
          property={property}
        />
      )}
    </>
  );
};

export default PropertyCard;
