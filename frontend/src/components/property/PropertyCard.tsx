import styled from "styled-components";
import { FC, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../common/Button";
import Dialog from "../common/Dialog";
import DialogActions from "../common/DialogActions";
import DialogContent from "../common/DialogContent";
import DialogTitle from "../common/DialogTitle";
import HelperText from "../common/HelperText";
import Paper, { PaperProps } from "../common/Paper";
import Typography from "../common/Typography";
import { createAddress } from "./utils";
import {
  deleteProperty,
  selectProperty,
  selectPropertyImage,
} from "../../store/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

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

const CardActions = styled.div`
  align-items: center;
  display: flex;
  padding: 0.5rem;
`;

interface PropertyCardProps extends PaperProps {
  propertyId: number;
  showActions?: boolean;
}

const PropertyCard: FC<PropertyCardProps> = ({
  propertyId,
  showActions,
  ...paperProps
}) => {
  const dispatch = useAppDispatch();

  const property = useAppSelector(selectProperty(propertyId));
  const propertyImage = useAppSelector(
    selectPropertyImage(property?.images[0])
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");

  if (!property) {
    return null;
  }

  const propertyName = property.name || property.address1;

  const handleDelete = () => {
    dispatch(deleteProperty({ propertyId })).catch((error) => {
      if (typeof error === "string") {
        setError(error);
      }
    });
  };

  return (
    <>
      <CardRoot {...paperProps}>
        <CardLinkWrapper to={`/properties/${propertyId}`}>
          {propertyImage && (
            <CardMedia
              style={{ backgroundImage: `url(${propertyImage.url})` }}
            />
          )}
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
      <Dialog
        open={showActions && showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <DialogTitle>Delete {propertyName}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {propertyName}?
          </Typography>
          {error && (
            <HelperText error showIcon>
              Failed to delete: {error}
            </HelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="text" color="error" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PropertyCard;
