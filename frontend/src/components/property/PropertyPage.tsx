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
import Paper from "../common/Paper";
import Typography from "../common/Typography";
import Button from "../common/Button";
import { createAddress } from "./utils";

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

const MainContentWrapper = styled.div`
  display: flex;
  gap: 3rem;
  padding: 2rem 0;
`;

const ContactSidebar = styled(Paper)`
  align-self: start;
  /* border: 1px solid black; // TODO: use divider color from palette */
  display: none;
  flex-grow: 2;
  max-width: 40ch;
  padding: 1.5rem;
  position: sticky;
  top: calc(64px + 2rem); // The height of the navbar + extra

  ${(props) => props.theme.breakpoints.up("lg", props.theme)} {
    display: block;
  }

  h2 {
    text-align: center;
  }

  ${Button} {
    width: 100%;
  }
`;

const MainContent = styled.main`
  flex: 1;

  section {
    padding: 2rem 0;
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

  const propertyName = property.name || property.address1;
  const propertyOwnerName =
    property.owner.company ||
    `${property.owner.firstName} ${property.owner.lastName}`;

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
      <MainContentWrapper>
        <MainContent>
          <Typography variant="h1" gutterBottom>
            {propertyName}
          </Typography>
          <Typography>{createAddress(property)}</Typography>
          <section>
            <Typography variant="h2" gutterBottom>
              About {propertyName}
            </Typography>
            <Typography gutterBottom>Listing by {propertyOwnerName}</Typography>
            <Typography gutterBottom>
              Built in {property.builtInYear}
            </Typography>
          </section>
          <section>
            <Typography variant="h2" gutterBottom>
              Contact
            </Typography>
            <Typography gutterBottom>
              Have questions or interested in leasing? Speak with{" "}
              {propertyOwnerName} by clicking the button below!
            </Typography>
            <Button
              as="a"
              href={`mailto:${property.owner.email}`}
              target="_blank"
            >
              Send an Email
            </Button>
          </section>
        </MainContent>
        <ContactSidebar as="aside" elevation={2}>
          <Typography variant="h4" as="h2" gutterBottom>
            Contact This Property
          </Typography>
          <Button
            as="a"
            href={`mailto:${property.owner.email}`}
            target="_blank"
          >
            Send an Email
          </Button>
        </ContactSidebar>
      </MainContentWrapper>
    </Container>
  );
};

export default PropertyPage;
