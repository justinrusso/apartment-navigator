import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Container from "../common/Container";
import LoadingCircle from "../common/LoadingCircle";
import {
  fetchProperty,
  selectProperty,
  selectPropertyImages,
} from "../../store/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const ImageGrid = styled.div`
  display: grid;
  gap: 0.5rem;
  overflow: hidden;

  grid-template-columns: repeat(2, 1fr);

  & > *:nth-child(n + 3) {
    display: none;
  }

  ${(props) => props.theme.breakpoints.up("md", props.theme)} {
    grid-template-columns: repeat(3, 1fr);

    & > *:nth-child(n) {
      &:nth-child(n) {
        display: block;
      }

      &:nth-child(n + 4) {
        display: none;
      }
    }
  }

  ${(props) => props.theme.breakpoints.up("lg", props.theme)} {
    grid-template-columns: repeat(4, 1fr);
    & > *:first-child {
      grid-row: span 2;
      grid-column: span 2;
    }

    & > *:nth-child(n) {
      &:nth-child(n) {
        display: block;
      }

      &:nth-child(n + 6) {
        display: none;
      }
    }
  }
`;

const Image = styled.div`
  width: 100%;
  padding-top: 62.5%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  & > * {
    height: 100%;
  }
`;

const PropertyPage: FC = () => {
  const dispatch = useAppDispatch();

  const { propertyId } = useParams();
  const property = useAppSelector(
    selectProperty(parseInt(propertyId || "", 10))
  );
  const propertyImages = useAppSelector(
    selectPropertyImages(property?.images || [])
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      return;
    }
    (async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchProperty({ propertyId })).unwrap();
      } catch (e) {
        // TODO: display error page?
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dispatch, propertyId]);

  if (!property && isLoading) {
    return <LoadingCircle />;
  }

  if (!property) {
    return null;
  }

  return (
    <Container>
      {propertyImages.length > 0 && (
        <ImageGrid>
          {propertyImages.map((propertyImage) => (
            <Image
              key={propertyImage.id}
              style={{ backgroundImage: `url(${propertyImage.url})` }}
            />
          ))}
        </ImageGrid>
      )}
    </Container>
  );
};

export default PropertyPage;
