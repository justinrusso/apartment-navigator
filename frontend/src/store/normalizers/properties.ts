import { schema } from "normalizr";
import { UserData } from "../../api/auth";
import { PropertyCategoryData } from "../../api/properties";

const propertyCategorySchema = new schema.Entity("categories");
export const propertyCategoryArraySchema = new schema.Array(
  propertyCategorySchema
);

const propertyImageSchema = new schema.Entity("images");
const propertyUnitSchema = new schema.Entity("units", {
  images: [propertyImageSchema],
});

export interface NormalizedProperty {
  id: number;
  owner: UserData;
  category: PropertyCategoryData;
  builtInYear: number;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  images: number[];
  units: number[];
  createdAt: string;
  updatedAt: string;
}

export const propertySchema = new schema.Entity("properties", {
  images: [propertyImageSchema],
  units: [propertyUnitSchema],
});
