import styled from "styled-components";
import { FaRegBuilding } from "react-icons/fa";
import { FC } from "react";
import { IconType } from "react-icons";
import { MdOutlineHouse } from "react-icons/md";

import Button from "../common/Button";
import Grid from "../common/Grid";
import { useAppSelector } from "../../hooks/redux";
import { selectPropertyCategoriesArray } from "../../store/properties";

const CATEGORY_ICONS: { [key: number]: IconType } = {
  1: MdOutlineHouse,
  2: FaRegBuilding,
};

const RadioButtonGroup = styled.fieldset`
  border: none;
  position: relative;
  width: 100%;

  input {
    clip: rect(0, 0, 0, 0);
    pointer-events: none;
    position: absolute;

    &:checked + label {
      background-color: lightgreen; // TODO: use prop.color's color, use a hover opcaity
      border-color: green;
    }
  }

  ${Button} {
    --padding-y: 1em;
    align-items: center;
    display: flex;
    gap: 0.5em;
    justify-content: center;
    user-select: none;

    svg {
      font-size: 2.5rem;
    }
  }
`;

interface PropertyCategoryInputProps {
  onChange: (newValue: string) => void;
  value: string;
}

const PropertyCategoryInput: FC<PropertyCategoryInputProps> = ({
  onChange,
  value,
}) => {
  const categoriesArray = useAppSelector(selectPropertyCategoriesArray());

  return (
    <Grid columnSpacing="1rem" rowSpacing="1.25rem">
      {categoriesArray.map((category) => {
        const Icon = CATEGORY_ICONS[category.id];
        return (
          <Grid item xs={6} key={category.id}>
            <RadioButtonGroup>
              <input
                type="radio"
                value={category.id}
                checked={parseInt(value, 10) === category.id}
                onChange={() => onChange(String(category.id))}
              />
              <Button
                as="label"
                variant="outlined"
                onClick={() => onChange(String(category.id))}
              >
                <Icon />
                {category.name}
              </Button>
            </RadioButtonGroup>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PropertyCategoryInput;
