import styled from "styled-components";
import { FC, useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";

import Button from "../common/Button";
import Container from "../common/Container";
import LoadingCircle from "../common/LoadingCircle";
import MenuItem from "../common/MenuItem";
import MenuList from "../common/MenuList";
import Paper from "../common/Paper";
import PropertyLocationDialog from "./dialogs/PropertyLocationDialog";
import PropertyNameDialog from "./dialogs/PropertyNameDialog";
import PropertyYearDialog from "./dialogs/PropertyYearDialog";
import RequireUser from "../auth/RequireUser";
import Typography from "../common/Typography";
import { createAddress, currencyFormatter, sqFtFormatter } from "./utils";
import {
  fetchProperty,
  selectProperty,
  selectPropertyUnits,
} from "../../store/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import UnitDeleteDialog from "./dialogs/UnitDeleteDialog";

const ContentWrapper = styled.div`
  padding: 2rem 0;

  h1 {
    text-align: center;
  }

  .sections-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

    &:not(:last-child) {
      border-bottom: 1px solid ${(props) => props.theme.palette.divider};
    }

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

const UnitsTable = styled.table`
  min-width: 650px;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  thead,
  tbody {
    text-align: right;
  }

  thead > * {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.5rem;
    letter-spacing: 0.01071em;
    vertical-align: middle;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
  }
  tbody > * {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.43;
    letter-spacing: 0.01071em;
    vertical-align: middle;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
  }

  tbody > *:last-child {
    border: none;
  }

  th,
  td {
    padding: 1rem;
  }

  th:first-child {
    text-align: left;
  }
`;

const PropertyEditPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { propertyId: propertyIdString } = useParams();
  const propertyId = parseInt(propertyIdString || "", 10);

  const [isLoading, setIsLoading] = useState(false);
  const [modals, setModals] = useImmer({
    deleteUnit: false,
    name: false,
    location: false,
    year: false,
  });
  const [selectedUnitId, setSelectedUnitId] = useState(0);

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

  const property = useAppSelector(selectProperty(propertyId));
  const units = useAppSelector(selectPropertyUnits(propertyId));

  const sortedUnits = useMemo(
    () =>
      units.sort((unitA, unitB) =>
        (unitA.unitNum || "").localeCompare(unitB.unitNum || "", "en", {
          numeric: true,
        })
      ),
    [units]
  );

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
          <div className="sections-container">
            <Paper as="section">
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
                      draft.year = true;
                    })
                  }
                >
                  <div className="left">
                    <Typography className="menu-item-label">
                      Year Built
                    </Typography>
                    <div>{property.builtInYear}</div>
                  </div>
                  <div className="right">
                    <MdKeyboardArrowRight />
                  </div>
                </MenuItem>
                {modals.year && (
                  <PropertyYearDialog
                    onClose={() =>
                      setModals((draft) => {
                        draft.year = false;
                      })
                    }
                    open={modals.year}
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
                    <Typography className="menu-item-label">
                      Location
                    </Typography>
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
            <Paper as="section">
              <Typography variant="h2">Property Images</Typography>
              <MenuList>
                <MenuItem onClick={() => navigate("images")}>
                  <div className="left">
                    <Typography className="menu-item-label">Images</Typography>
                    <div>
                      <Typography>
                        {property.images.length} image
                        {property.images.length !== 1 ? "s" : ""}
                      </Typography>
                    </div>
                  </div>
                  <div className="right">
                    <MdKeyboardArrowRight />
                  </div>
                </MenuItem>
              </MenuList>
            </Paper>
            <Paper as="section">
              <Typography variant="h2">Unit Details</Typography>
              <UnitsTable>
                <thead>
                  <tr>
                    <th>Unit #</th>
                    <th>Bedrooms</th>
                    <th>Baths</th>
                    <th>Price</th>
                    <th>Sq Ft</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUnits.map((unit) => (
                    <tr key={unit.id}>
                      <th>{unit.unitNum}</th>
                      <td>{unit.unitCategory.name}</td>
                      <td>{unit.baths / 100}</td>
                      <td>{currencyFormatter.format(unit.price.price)}</td>
                      <td>{sqFtFormatter.format(unit.sqFt)}</td>
                      <td>
                        {property.category.id !== 1 && (
                          <Button
                            variant="text"
                            color="error"
                            onClick={() => {
                              setModals((draft) => {
                                draft.deleteUnit = true;
                              });
                              setSelectedUnitId(unit.id);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </UnitsTable>
              {modals.deleteUnit && (
                <UnitDeleteDialog
                  onClose={() => {
                    setModals((draft) => {
                      draft.deleteUnit = false;
                    });
                    setSelectedUnitId(0);
                  }}
                  open={modals.deleteUnit}
                  unitId={selectedUnitId}
                />
              )}
            </Paper>
          </div>
        </ContentWrapper>
      </Container>
    </RequireUser>
  );
};

export default PropertyEditPage;
