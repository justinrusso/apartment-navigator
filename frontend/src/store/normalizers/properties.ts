import { schema } from "normalizr";
import { UserData } from "../../api/auth";
import { PropertyCategoryData, PropertyUnit } from "../../api/properties";

const propertyCategorySchema = new schema.Entity("categories");
export const propertyCategoryArraySchema = new schema.Array(
  propertyCategorySchema
);

const propertyImageSchema = new schema.Entity("images");

export type NormalizedPropertyUnit = Omit<PropertyUnit, "images"> & {
  images: number[];
};

export const propertyUnitSchema = new schema.Entity("units", {
  images: [propertyImageSchema],
});

export interface NormalizedProperty {
  id: number;
  owner: UserData;
  category: PropertyCategoryData;
  builtInYear: number;
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  reviews?: number[];
  reviewSummary: {
    propertyId: number;
    total: number;
    averageRating: number;
  };
  images: number[];
  units: number[];
  createdAt: string;
  updatedAt: string;
}

export const propertySchema = new schema.Entity("properties", {
  images: [propertyImageSchema],
  units: [propertyUnitSchema],
});
export const propertiesSchema = new schema.Array(propertySchema);
