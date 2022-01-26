import { NormalizedProperty } from "../../../store/normalizers/properties";

export interface PropertyEditorDialogProps {
  onClose: () => void;
  open: boolean;
  property: NormalizedProperty;
}
