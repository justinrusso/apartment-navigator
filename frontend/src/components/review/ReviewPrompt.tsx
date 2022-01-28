import styled from "styled-components";
import { FC } from "react";

import Button from "../common/Button";
import Typography from "../common/Typography";
import RatingStars from "./RatingStars";
import { NormalizedProperty } from "../../store/normalizers/properties";
import { formatRatingNumber } from "./utils";

const ReviewPromptRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;

  & > * {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
  }

  .rating {
    font-weight: 500;
  }

  .cta-wrapper {
    max-width: 17rem;
  }
`;

type ReviewPromptProps = {
  reviewSummary: NormalizedProperty["reviewSummary"];
  showModal: () => void;
};

const ReviewPrompt: FC<ReviewPromptProps> = ({ reviewSummary, showModal }) => {
  return (
    <ReviewPromptRoot>
      <div>
        <RatingStars
          rating={reviewSummary.averageRating}
          size="large"
          disableInput
        />
        <Typography as="span" variant="h5" className="rating">
          {formatRatingNumber(reviewSummary.averageRating)} Average Rating
        </Typography>
        <Typography as="span">
          {reviewSummary.total > 0
            ? `${reviewSummary.total} Renter Review${
                reviewSummary.total !== 1 ? "s" : ""
              }`
            : "No Renter Reviews Yet"}
        </Typography>
      </div>
      <div className="cta-wrapper">
        <Typography>
          Share details of your own experience with this property
        </Typography>
        <Button onClick={showModal}>Write a Review</Button>
      </div>
    </ReviewPromptRoot>
  );
};

export default ReviewPrompt;
