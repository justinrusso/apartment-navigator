import styled from "styled-components";
import { FC } from "react";

import Paper from "../common/Paper";
import RatingStars from "./RatingStars";
import Typography from "../common/Typography";
import { ReviewData } from "../../api/reviews";

const ReviewCardRoot = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
`;

type ReviewCardProps = {
  review: ReviewData;
};

const ReviewCard: FC<ReviewCardProps> = ({ review }) => {
  const date = new Date(review.updatedAt);
  return (
    <ReviewCardRoot elevation={4}>
      <Typography gutterBottom as="span">
        <RatingStars rating={review.rating} size="medium" disableInput />
      </Typography>
      <Typography gutterBottom variant="body2">
        {date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </Typography>
      <Typography>{review.comment}</Typography>
    </ReviewCardRoot>
  );
};

export default ReviewCard;
