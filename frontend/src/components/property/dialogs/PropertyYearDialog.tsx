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

const PropertyYearDialog: FC<PropertyEditorDialogProps> = ({
  onClose,
  open,
  property,
}) => {
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fields, getChangedFields, prestine, setField } = useFormFields({
    builtInYear: String(property.builtInYear),
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
      <DialogTitle>Year Built</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid columnSpacing="1rem" rowSpacing="1.25rem">
            <Grid item>
              <InputField
                label="Year Built"
                fullWidth
                id="property-builtInYear"
                value={fields.builtInYear}
                onChange={(e) => setField("builtInYear", e.target.value)}
                inputProps={{
                  type: "text",
                }}
                error={!!errors.builtInYear}
                helperText={errors.builtInYear}
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

export default PropertyYearDialog;
