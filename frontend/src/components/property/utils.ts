import { NormalizedProperty } from "../../store/normalizers/properties";

export function createAddress(property: NormalizedProperty): string {
  let address = property.address1;
  if (property.address2) {
    address += `, ${property.address2}`;
  }
  return `${address}, ${property.city}, ${property.state} ${property.zipCode}`;
}

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const sqFtFormatter = new Intl.NumberFormat("en-US", {});
