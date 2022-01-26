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

const PropertyLocationDialog: FC<PropertyEditorDialogProps> = ({
  onClose,
  open,
  property,
}) => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fields, getChangedFields, prestine, setField } = useFormFields({
    address1: property.address1,
    address2: property.address2 || "",
    city: property.city,
    state: property.state,
    zipCode: property.zipCode,
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
      <DialogTitle>Property Location</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid columnSpacing="1rem" rowSpacing="1.25rem">
            <Grid item>
              <InputField
                label="Address"
                fullWidth
                id="property-address1"
                value={fields.address1}
                onChange={(e) => setField("address1", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.address1}
                helperText={errors.address1}
                required
              />
            </Grid>
            <Grid item>
              <InputField
                label="Address Secondary"
                fullWidth
                id="property-address2"
                value={fields.address2}
                onChange={(e) => setField("address2", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.address2}
                helperText={errors.address2}
              />
            </Grid>
            <Grid item sm={6}>
              <InputField
                label="City"
                fullWidth
                id="property-city"
                value={fields.city}
                onChange={(e) => setField("city", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>
            <Grid item sm={6}>
              <InputField
                label="State"
                fullWidth
                id="property-state"
                value={fields.state}
                onChange={(e) => setField("state", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.state}
                helperText={errors.state}
                required
              />
            </Grid>
            <Grid item sm={6}>
              <InputField
                label="Zip Code"
                fullWidth
                id="property-zipcode"
                value={fields.zipCode}
                onChange={(e) => setField("zipCode", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                required
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

export default PropertyLocationDialog;
