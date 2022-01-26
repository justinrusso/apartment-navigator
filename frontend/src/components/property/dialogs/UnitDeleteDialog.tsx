import { FC, useState } from "react";

import Button from "../../common/Button";
import Dialog from "../../common/Dialog";
import DialogActions from "../../common/DialogActions";
import DialogContent from "../../common/DialogContent";
import DialogTitle from "../../common/DialogTitle";
import HelperText from "../../common/HelperText";
import Typography from "../../common/Typography";
import { PropertyUnitEditorDialogProps } from ".";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  deletePropertyUnit,
  selectPropertyUnit,
} from "../../../store/properties";

interface UnitDeleteDialogProps
  extends Omit<PropertyUnitEditorDialogProps, "unit"> {
  unitId: number;
}

const UnitDeleteDialog: FC<UnitDeleteDialogProps> = ({
  onClose,
  open,
  unitId,
}) => {
  const dispatch = useAppDispatch();

  const unit = useAppSelector(selectPropertyUnit(unitId));

  const [error, setError] = useState<string>("");

  const handleDelete = () => {
    dispatch(deletePropertyUnit({ unitId: unit.id }))
      .then(() => onClose())
      .catch((error) => {
        if (typeof error === "string") {
          setError(error);
        }
      });
  };

  if (!unit) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Unit</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete unit {unit.unitNum}?
        </Typography>
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

export default UnitDeleteDialog;
