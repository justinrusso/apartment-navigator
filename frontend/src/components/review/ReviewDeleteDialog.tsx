import { FC, useState } from "react";

import Button from "../common/Button";
import Dialog from "../common/Dialog";
import DialogActions from "../common/DialogActions";
import DialogContent from "../common/DialogContent";
import DialogTitle from "../common/DialogTitle";
import HelperText from "../common/HelperText";
import RatingStars from "./RatingStars";
import Typography from "../common/Typography";
import { NormalizedProperty } from "../../store/normalizers/properties";
import { ReviewData } from "../../api/reviews";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  deletePropertyReview,
  selectPropertyReview,
} from "../../store/properties";

type ReviewDeleteDialogProps = {
  onClose: () => void;
  property: NormalizedProperty;
  reviewId?: number;
};

const ReviewDeleteDialog: FC<ReviewDeleteDialogProps> = ({
  onClose,
  property,
  reviewId,
}) => {
  const dispatch = useAppDispatch();

  const review: ReviewData | undefined = useAppSelector(
    selectPropertyReview(reviewId || 0)
  );

  const [error, setError] = useState<string>("");

  const handleDelete = () => {
    if (!reviewId) {
      return;
    }
    dispatch(deletePropertyReview({ reviewId }))
      .then(() => onClose())
      .catch((error) => {
        if (typeof error === "string") {
          setError(error);
        }
      });
  };

  if (!review) {
    return null;
  }

  const date = new Date(review.updatedAt);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Delete Review</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Are you sure you want to this review?
        </Typography>
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
        {error && (
          <HelperText error showIcon>
            Failed to delete: {error}
          </HelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewDeleteDialog;
