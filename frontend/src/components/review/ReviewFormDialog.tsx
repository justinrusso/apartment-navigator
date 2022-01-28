import { FC, FormEvent, useState } from "react";

import Button from "../common/Button";
import Dialog from "../common/Dialog";
import DialogActions from "../common/DialogActions";
import DialogContent from "../common/DialogContent";
import DialogTitle from "../common/DialogTitle";
import Grid from "../common/Grid";
import HelperText from "../common/HelperText";
import InputField from "../common/InputField";
import RatingStars from "./RatingStars";
import useFormFields from "../../hooks/form-fields";
import {
  addPropertyReview,
  editPropertyReview,
  selectPropertyReview,
} from "../../store/properties";
import { NormalizedProperty } from "../../store/normalizers/properties";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ReviewData } from "../../api/reviews";

const getRatingHelperText = (rating: number) => {
  switch (rating) {
    case 1:
      return "This property is poor";
    case 2:
      return "This property is ok";
    case 3:
      return "This property is good";
    case 4:
      return "This property is great";
    case 5:
      return "This property is excellent";
    default:
      return "Choose a rating";
  }
};

type ReviewFormDialogProps = {
  onClose: () => void;
  property: NormalizedProperty;
  reviewId?: number;
};

const ReviewFormDialog: FC<ReviewFormDialogProps> = ({
  onClose,
  property,
  reviewId,
}) => {
  const dispatch = useAppDispatch();

  const review: ReviewData | undefined = useAppSelector(
    selectPropertyReview(reviewId || 0)
  );

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { fields, getChangedFields, prestine, setField } = useFormFields({
    comment: review?.comment || "",
    rating: review ? String(review.rating) : "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prestine) {
      onClose();
      return;
    }

    if (!fields.rating) {
      setErrors({
        rating: ["Provide a rating."],
      });
      return;
    }

    const changedFields = getChangedFields();

    if (review) {
      dispatch(
        editPropertyReview({
          reviewId: review.id,
          data: changedFields,
        })
      )
        .unwrap()
        .then(() => onClose())
        .catch((errors) => setErrors(errors));
      return;
    }

    dispatch(
      addPropertyReview({
        propertyId: property.id,
        data: changedFields as Required<typeof changedFields>,
      })
    )
      .unwrap()
      .then(() => onClose())
      .catch((errors) => setErrors(errors));
  };

  const fieldRatingNumber = parseInt(fields.rating, 10) || 0;

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>
        Rate & Review {property.name || property.address1}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid columnSpacing="1rem" rowSpacing="1.25rem">
            <Grid item>
              <RatingStars
                rating={fieldRatingNumber}
                size="large"
                onChange={(newValue) => setField("rating", String(newValue))}
              />
              {errors.rating && (
                <HelperText error showIcon>
                  {errors.rating?.join(" ")}
                </HelperText>
              )}
              <HelperText>{getRatingHelperText(fieldRatingNumber)}</HelperText>
            </Grid>
            <Grid item>
              <InputField
                label="Your Comment"
                fullWidth
                id="property-comment"
                value={fields.comment}
                onChange={(e) => setField("comment", e.target.value)}
                inputProps={{
                  as: "textarea",
                  rows: 3,
                }}
                required
                error={!!errors.comment}
                helperText={errors.comment?.join(" ")}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="text" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button>Submit Review</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReviewFormDialog;
