import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";

import Container from "../common/Container";
import LoadingCircle from "../common/LoadingCircle";
import MenuItem from "../common/MenuItem";
import MenuList from "../common/MenuList";
import Paper from "../common/Paper";
import PropertyLocationDialog from "./dialogs/PropertyLocationDialog";
import PropertyNameDialog from "./dialogs/PropertyNameDialog";
import RequireUser from "../auth/RequireUser";
import Typography from "../common/Typography";
import { createAddress } from "./utils";
import { fetchProperty, selectProperty } from "../../store/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const ContentWrapper = styled.div`
  padding: 2rem 0;

  h1 {
    text-align: center;
  }

  ${Paper} {
    border: 1px solid ${(props) => props.theme.palette.divider};
    padding: 1rem;
  }

  ${MenuItem} {
    padding-bottom: 0.75rem;
    padding-top: 0.75rem;

    display: flex;
    align-items: center;

    .left {
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 0;

      ${(props) => props.theme.breakpoints.up("sm", props.theme)} {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
      }

      .menu-item-label {
        flex-basis: 156px;
        weight: 500;
        display: flex;
        align-items: center;
        text-transform: uppercase;
        font-size: 0.75rem;
        color: ${(props) => props.theme.palette.text.secondary};
      }

      ${Typography} {
        white-space: pre-wrap;
      }
    }
    .right {
      flex-grow: 0;
      flex-shrink: 0;
      padding-left: 16px;
    }
  }
`;

const PropertyEditPage: FC = () => {
  const dispatch = useAppDispatch();

  const { propertyId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [modals, setModals] = useImmer({
    name: false,
    location: false,
  });

  const property = useAppSelector(
    selectProperty(parseInt(propertyId || "", 10))
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

  return (
    <RequireUser
      redirectTo={`/properties/${propertyId}`}
      userId={property.owner.id || 0}
    >
      <Container>
        <ContentWrapper>
          <Typography variant="h1" gutterBottom>
            Manage {property.name || property.address1}
          </Typography>
          <Paper>
            <Typography variant="h2">Property Info</Typography>
            <MenuList>
              <MenuItem
                onClick={() =>
                  setModals((draft) => {
                    draft.name = true;
                  })
                }
              >
                <div className="left">
                  <Typography className="menu-item-label">
                    Property Name
                  </Typography>
                  <div>
                    <Typography>{property.name}</Typography>
                  </div>
                </div>
                <div className="right">
                  <MdKeyboardArrowRight />
                </div>
              </MenuItem>
              {modals.name && (
                <PropertyNameDialog
                  onClose={() =>
                    setModals((draft) => {
                      draft.name = false;
                    })
                  }
                  open={modals.name}
                  property={property}
                />
              )}
              <MenuItem
                onClick={() =>
                  setModals((draft) => {
                    draft.location = true;
                  })
                }
              >
                <div className="left">
                  <Typography className="menu-item-label">Location</Typography>
                  <div>
                    <Typography>{createAddress(property)}</Typography>
                  </div>
                </div>
                <div className="right">
                  <MdKeyboardArrowRight />
                </div>
              </MenuItem>
              {modals.location && (
                <PropertyLocationDialog
                  onClose={() =>
                    setModals((draft) => {
                      draft.location = false;
                    })
                  }
                  open={modals.location}
                  property={property}
                />
              )}
            </MenuList>
          </Paper>
        </ContentWrapper>
      </Container>
    </RequireUser>
  );
};

export default PropertyEditPage;
