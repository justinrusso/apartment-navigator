import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../common/Button";
import Dialog, { DialogProps } from "../../common/Dialog";
import DialogActions from "../../common/DialogActions";
import DialogContent from "../../common/DialogContent";
import DialogTitle from "../../common/DialogTitle";
import HelperText from "../../common/HelperText";
import Typography from "../../common/Typography";
import { NormalizedProperty } from "../../../store/normalizers/properties";
import { deleteProperty } from "../../../store/properties";
import { useAppDispatch } from "../../../hooks/redux";

type PropertyDeleteDialogProps = DialogProps & {
  property: NormalizedProperty;
};

const PropertyDeleteDialog: FC<PropertyDeleteDialogProps> = ({
  open,
  onClose,
  property,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleDelete = () => {
    dispatch(deleteProperty({ propertyId: property.id }))
      .unwrap()
      .then(() => {
        navigate("/properties/manage");
      })
      .catch((error) => {
        if (typeof error === "string") {
          setError(error);
        }
      });
  };

  const propertyName = property.name || property.address1;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete {propertyName}</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete {propertyName}?</Typography>
        {error && (
          <HelperText error showIcon>
            Failed to delete: {error}
          </HelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="text" color="error" onClick={handleDelete}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDeleteDialog;
