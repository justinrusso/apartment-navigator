import { schema } from "normalizr";

export const reviewSchema = new schema.Entity("reviews");
export const reviewsSchema = new schema.Array(reviewSchema);
