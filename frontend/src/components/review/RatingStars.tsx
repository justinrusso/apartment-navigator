import styled from "styled-components";
import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { MdStar, MdStarBorder, MdStarHalf } from "react-icons/md";
import { IconType } from "react-icons";

const RATING_VALUES = [1, 2, 3, 4, 5];

const RatingsWrapper = styled.span`
  color: ${(props) => props.theme.palette.primary.main};
  display: inline-flex;
  font-size: var(--font-size);
  width: fit-content;

  span {
    position: relative;

    input {
      clip: rect(0, 0, 0, 0);
      pointer-events: none;
      position: absolute;
    }
  }
`;

function roundHalf(num: number) {
  return Math.round(num * 2) / 2;
}

function getIcon(rating: number, forValue: number): IconType {
  if (rating % 1 !== 0 && Math.round(rating) === forValue) {
    return MdStarHalf;
  }
  if (rating < forValue) {
    return MdStarBorder;
  }
  return MdStar;
}

export function getStarSize(size: StarSize) {
  if (size === "large") {
    return "2.2rem";
  } else if (size === "medium") {
    return "1.6rem";
  } else {
    return "1.1875rem";
  }
}

type StarSize = "large" | "medium" | "small";

type RatingStarsProps = {
  disableInput?: boolean;
  rating: number; // 0 - 5
  onChange?: (newValue: number) => void;
  size: StarSize;
};

const RatingStars: FC<RatingStarsProps> = ({
  disableInput,
  onChange,
  rating,
  size,
}) => {
  if (!disableInput && !onChange) {
    throw new Error("onChange must be provided if input is enabled");
  }

  const [value, setValue] = useState(roundHalf(rating));

  useEffect(() => {
    setValue(roundHalf(rating));
  }, [rating]);

  const handleClick = (e: MouseEvent<Element>, newValue: number) => {
    e.preventDefault();
    if (disableInput || !onChange) {
      return;
    }
    onChange(newValue);
  };

  const handleChange = (e: ChangeEvent<Element>, newValue: number) => {
    e.preventDefault();
    if (disableInput || !onChange) {
      return;
    }
    onChange(newValue);
  };

  const handleMouseEnter = (newValue: number) => {
    if (disableInput) {
      return;
    }
    setValue(newValue);
  };

  const handleMouseLeave = () => {
    if (value !== rating) {
      setValue(roundHalf(rating));
    }
  };

  return (
    <RatingsWrapper
      style={{ ["--font-size" as any]: getStarSize(size) }}
      onMouseLeave={disableInput ? undefined : handleMouseLeave}
    >
      {RATING_VALUES.map((ratingValue) => {
        const Icon = getIcon(value, ratingValue);

        return (
          <span key={ratingValue}>
            <Icon
              onClick={(e) => handleClick(e, ratingValue)}
              onMouseEnter={() => handleMouseEnter(ratingValue)}
            />
            <input
              type="radio"
              onChange={(e) => handleChange(e, ratingValue)}
              value={String(ratingValue)}
              checked={rating === ratingValue}
            />
          </span>
        );
      })}
    </RatingsWrapper>
  );
};

export default RatingStars;
