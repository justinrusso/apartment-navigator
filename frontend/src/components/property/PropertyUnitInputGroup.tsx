import styled from "styled-components";
import { FC } from "react";
import { MdDelete } from "react-icons/md";

import InputField from "../common/InputField";
import { CreatePropertyData } from "../../api/properties";
import { useAppSelector } from "../../hooks/redux";
import { selectUnitCategories } from "../../store/units";
import IconButton from "../common/IconButton";
import Grid from "../common/Grid";
import { BATH_OPTIONS } from ".";

const PropertyUnitInputGroupRoot = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  }

  & > *:not(${IconButton}) {
    flex: 1;
  }

  ${IconButton} {
    align-self: start;
    position: sticky;
    top: calc(64px + 0.5rem); // The height of the navbar + extra
  }
`;

interface PropertyUnitInputGroupProps {
  id: number;
  onChange: (
    key: keyof PropertyUnitInputGroupProps["unit"],
    newValue: string
  ) => void;
  onDelete: () => void;
  singleUnit?: boolean;
  unit: Exclude<CreatePropertyData["units"], undefined>[0];
  unitCount: number;
}

const PropertyUnitInputGroup: FC<PropertyUnitInputGroupProps> = ({
  id,
  onChange,
  onDelete,
  singleUnit,
  unit,
  unitCount,
}) => {
  const unitCategories = useAppSelector(selectUnitCategories());

  return (
    <PropertyUnitInputGroupRoot>
      <Grid spacing="0.75rem">
        {!singleUnit && (
          <Grid item sm={6} md={4}>
            <InputField
              fullWidth
              label="Unit"
              id={`property-unit-number-${id}`}
              value={unit.unitNum}
              onChange={(e) => onChange("unitNum", e.target.value)}
              inputProps={{
                type: "text",
              }}
              required={!singleUnit}
            />
          </Grid>
        )}
        <Grid item sm={6} md={4}>
          <InputField
            fullWidth
            label="Beds"
            id={`property-unit-beds-${id}`}
            value={unit.unitCategoryId}
            onChange={(e) => onChange("unitCategoryId", e.target.value)}
            inputProps={{
              as: "select",
            }}
            required
          >
            <option value="" />
            {unitCategories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </InputField>
        </Grid>
        <Grid item sm={6} md={4}>
          <InputField
            fullWidth
            label="Baths"
            id={`property-unit-baths-${id}`}
            value={unit.baths}
            onChange={(e) => onChange("baths", e.target.value)}
            inputProps={{
              as: "select",
            }}
            required
          >
            <option value="" />
            {BATH_OPTIONS.map((bathOption) => (
              <option key={bathOption} value={bathOption * 100}>
                {bathOption}
              </option>
            ))}
          </InputField>
        </Grid>
        <Grid item sm={6} md={4}>
          <InputField
            fullWidth
            label="Price"
            id={`property-unit-price-${id}`}
            value={unit.price}
            onChange={(e) => onChange("price", e.target.value)}
            inputProps={{
              type: "number",
            }}
            required
          />
        </Grid>
        <Grid item sm={6} md={4}>
          <InputField
            fullWidth
            label="Sq Ft"
            id={`property-unit-sqft-${id}`}
            value={unit.sqFt}
            onChange={(e) => onChange("sqFt", e.target.value)}
            inputProps={{
              type: "number",
            }}
            required
          />
        </Grid>
        <Grid item sm={6}>
          <InputField
            fullWidth
            label="Floor Plan Image Url"
            id={`property-unit-floor-plan-img-${id}`}
            value={unit.floorPlanImg}
            onChange={(e) => onChange("floorPlanImg", e.target.value)}
            inputProps={{
              type: "text",
            }}
          />
        </Grid>
      </Grid>
      {!singleUnit && unitCount > 1 && (
        <IconButton type="button" onClick={onDelete}>
          <MdDelete />
        </IconButton>
      )}
    </PropertyUnitInputGroupRoot>
  );
};

export default PropertyUnitInputGroup;
