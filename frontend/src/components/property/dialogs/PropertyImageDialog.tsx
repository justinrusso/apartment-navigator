import styled from "styled-components";
import { FC, FormEvent, useEffect, useMemo, useState } from "react";

import Button from "../../common/Button";
import Dialog from "../../common/Dialog";
import DialogActions from "../../common/DialogActions";
import DialogContent from "../../common/DialogContent";
import DialogTitle from "../../common/DialogTitle";
import DropperInput from "../../dropper/DropperInput";
import Grid from "../../common/Grid";
import HelperText from "../../common/HelperText";
import Typography from "../../common/Typography";
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

const PlaceholderWrapper = styled.div`
  text-align: center;
`;

const PropertyImageDialog: FC<PropertyEditorDialogProps> = ({
  onClose,
  open,
  property,
}) => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fields, getChangedFields, prestine, setField } = useFormFields({
    image: new File([], ""),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prestine) {
      onClose();
      return;
    }

    const changedFields = getChangedFields();

    if (!changedFields.image) {
      return;
    }

    dispatch(
      addPropertyImage({
        propertyId: property.id,
        image: changedFields.image,
      })
    )
      .unwrap()
      .then(() => onClose())
      .catch((errors) => setErrors(errors));
  };

  const preview = useMemo(() => {
    if (fields.image.name === "") {
      return null;
    }
    return URL.createObjectURL(fields.image);
  }, [fields.image]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add New Image</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid columnSpacing="1rem" rowSpacing="1.25rem">
            <Grid item>
              <DropperInput
                accept={[
                  "image/avif",
                  "image/gif",
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                ]}
                maxFiles={1}
                noClick
                onDrop={(acceptedFiles) => {
                  setField(
                    "image",
                    acceptedFiles.length > 0
                      ? acceptedFiles[0]
                      : new File([], "")
                  );
                }}
                placeholder={(open) => (
                  <PlaceholderWrapper>
                    <Typography gutterBottom>Drag & Drop an Image</Typography>
                    <Typography gutterBottom>or</Typography>
                    <Button variant="outlined" type="button" onClick={open}>
                      Browse Files
                    </Button>
                  </PlaceholderWrapper>
                )}
              />
            </Grid>
            {errors.image && (
              <Grid item>
                <HelperText error showIcon>
                  {errors.image}
                </HelperText>
              </Grid>
            )}
            {preview && (
              <Grid item>
                <Typography>Preview:</Typography>
                <Image style={{ backgroundImage: `url(${preview})` }} />
              </Grid>
            )}
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
