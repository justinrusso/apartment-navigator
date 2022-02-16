import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdAdd, MdDelete, MdKeyboardArrowLeft } from "react-icons/md";

import Button from "../common/Button";
import ButtonIconWrapper from "../common/ButtonIconWrapper";
import Container from "../common/Container";
import Grid from "../common/Grid";
import IconButton from "../common/IconButton";
import LoadingCircle from "../common/LoadingCircle";
import Paper from "../common/Paper";
import PropertyImageDialog from "./dialogs/PropertyImageDialog";
import RequireUser from "../auth/RequireUser";
import Typography from "../common/Typography";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  selectProperty,
  fetchProperty,
  selectPropertyImages,
  deletePropertyImage,
} from "../../store/properties";

const ContentWrapper = styled.div`
  padding: 2rem 0;

  h1 ${IconButton} {
    color: inherit;
    font-size: 0.7em;
  }

  .add-image-button-wrapper {
    display: flex;
    justify-content: end;
    padding-bottom: 0.5rem;
  }
`;

const Image = styled.div`
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 62.5%;
  position: relative;
  width: 100%;

  .delete-button {
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const PropertyEditImagesPage: FC = () => {
  const dispatch = useAppDispatch();

  const { propertyId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const property = useAppSelector(
    selectProperty(parseInt(propertyId || "", 10))
  );
  const propertyImages = useAppSelector(
    selectPropertyImages(property?.images || [])
  );

  useEffect(() => {
    if (!propertyId) {
      return;
    }
    (async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchProperty({ propertyId })).unwrap();
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dispatch, propertyId]);

  if (!property && isLoading) {
    return <LoadingCircle />;
  }

  if (!property) {
    // TODO: display 404 page?
    return null;
  }

  const handleDelte = (imageId: number) => {
    dispatch(deletePropertyImage({ imageId }));
  };

  return (
    <RequireUser
      redirectTo={`/properties/${propertyId}`}
      userId={property.owner.id || 0}
    >
      <Container>
        <ContentWrapper>
          <Typography variant="h1" gutterBottom>
            <IconButton as={Link} to="..">
              <MdKeyboardArrowLeft />
            </IconButton>
            {property.name || property.address1} Images
          </Typography>
          <div className="add-image-button-wrapper">
            <Button onClick={() => setAddModalVisible(true)}>
              <ButtonIconWrapper position="start">
                <MdAdd />
              </ButtonIconWrapper>
              Add Image
            </Button>
          </div>
          <Paper as="section">
            <Grid spacing="1rem">
              {propertyImages.map((image) => (
                <Grid item key={image.id} sm={6} md={4}>
                  <Image style={{ backgroundImage: `url(${image.url})` }}>
                    <IconButton
                      className="delete-button"
                      color="error"
                      type="button"
                      variant="contained"
                      onClick={() => handleDelte(image.id)}
                    >
                      <MdDelete />
                    </IconButton>
                  </Image>
                </Grid>
              ))}
            </Grid>
          </Paper>
          {addModalVisible && (
            <PropertyImageDialog
              onClose={() => setAddModalVisible(false)}
              open={addModalVisible}
              property={property}
            />
          )}
        </ContentWrapper>
      </Container>
    </RequireUser>
  );
};

export default PropertyEditImagesPage;
