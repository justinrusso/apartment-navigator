import { schema } from "normalizr";

const propertyCategorySchema = new schema.Entity("categories");
export const propertyCategoryArraySchema = new schema.Array(
  propertyCategorySchema
);
