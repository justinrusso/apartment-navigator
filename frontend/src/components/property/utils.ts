import { NormalizedProperty } from "../../store/normalizers/properties";

export function createAddress(property: NormalizedProperty): string {
  let address = property.address1;
  if (property.address2) {
    address += `, ${property.address2}`;
  }
  return `${address}, ${property.city}, ${property.state} ${property.zipCode}`;
}
