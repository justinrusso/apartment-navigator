import styled from "styled-components";
import { FC, FormEvent, useState } from "react";

import Button from "../../common/Button";
import Dialog from "../../common/Dialog";
import DialogActions from "../../common/DialogActions";
import DialogContent from "../../common/DialogContent";
import DialogTitle from "../../common/DialogTitle";
import Grid from "../../common/Grid";
import InputField from "../../common/InputField";
import useFormFields from "../../../hooks/form-fields";
import { PropertyEditorDialogProps } from ".";
import { useAppDispatch } from "../../../hooks/redux";
import { addPropertyImage } from "../../../store/properties";

const Image = styled.div`
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 62.5%;
  position: relative;
  width: 100%;
`;

const PropertyImageDialog: FC<PropertyEditorDialogProps> = ({
  onClose,
  open,
  property,
}) => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fields, getChangedFields, prestine, setField } = useFormFields({
    imageUrl: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prestine) {
      onClose();
      return;
    }

    const changedFields = getChangedFields();

    if (!changedFields.imageUrl) {
      return;
    }

    dispatch(
      addPropertyImage({
        propertyId: property.id,
        imageUrl: changedFields.imageUrl,
      })
    )
      .unwrap()
      .then(() => onClose())
      .catch((errors) => setErrors(errors));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Image</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid columnSpacing="1rem" rowSpacing="1.25rem">
            {fields.imageUrl && (
              <Grid item>
                <Image style={{ backgroundImage: `url(${fields.imageUrl})` }} />
              </Grid>
            )}
            <Grid item>
              <InputField
                label="Image Url"
                fullWidth
                id="property-imageUrl"
                value={fields.imageUrl}
                onChange={(e) => setField("imageUrl", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.imageUrl}
                helperText={errors.imageUrl}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="text" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button>Add Image</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PropertyImageDialog;
