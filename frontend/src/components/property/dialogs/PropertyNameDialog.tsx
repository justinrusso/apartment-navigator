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
import { editProperty } from "../../../store/properties";

const PropertyNameDialog: FC<PropertyEditorDialogProps> = ({
  onClose,
  open,
  property,
}) => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fields, getChangedFields, prestine, setField } = useFormFields({
    name: property.name || "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (prestine) {
      onClose();
      return;
    }

    dispatch(
      editProperty({
        id: property.id,
        ...getChangedFields(),
      })
    )
      .unwrap()
      .then(() => onClose())
      .catch((errors) => setErrors(errors));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Property Name</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid columnSpacing="1rem" rowSpacing="1.25rem">
            <Grid item>
              <InputField
                label="Property Name"
                fullWidth
                id="property-name"
                value={fields.name}
                onChange={(e) => setField("name", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="text" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button>Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PropertyNameDialog;
