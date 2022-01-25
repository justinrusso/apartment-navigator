import styled from "styled-components";
import { FaRegBuilding } from "react-icons/fa";
import { FC } from "react";
import { IconType } from "react-icons";
import { MdOutlineHouse } from "react-icons/md";

import Button from "../common/Button";
import ButtonIconWrapper from "../common/ButtonIconWrapper";
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
      background-color: hsla(var(--palette-primary-base), 10%);
      border-color: ${(props) => props.theme.palette.primary.main};
    }
  }

  ${Button} {
    --padding-y: 1em;
    display: flex;
    user-select: none;

    svg {
      font-size: 2.5em;
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
                <ButtonIconWrapper position="start">
                  <Icon />
                </ButtonIconWrapper>
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
