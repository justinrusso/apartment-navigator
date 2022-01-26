import {
  NormalizedProperty,
  NormalizedPropertyUnit,
} from "../../../store/normalizers/properties";

interface DialogBaseProps {
  onClose: () => void;
  open: boolean;
}

export interface PropertyEditorDialogProps extends DialogBaseProps {
  property: NormalizedProperty;
}

export interface PropertyUnitEditorDialogProps extends DialogBaseProps {
  unit: NormalizedPropertyUnit;
}
