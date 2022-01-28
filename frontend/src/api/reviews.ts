import { routeBuilder, fetchApi } from "./util";

const reviewsRoute = routeBuilder("/api/reviews");

export class ReviewsApi {
  static async updatePropertyReview(
    reviewId: number,
    data: Partial<EditableReviewData>
  ) {
    return fetchApi(reviewsRoute(`/${reviewId}`), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async deletePropertyReview(reviewId: number) {
    return fetchApi(reviewsRoute(`/${reviewId}`), {
      method: "DELETE",
    });
  }
}

export interface ReviewData {
  id: number;
  propertyId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditableReviewData {
  comment: string;
  rating: number | string;
}

export interface ReviewSummary {
  averageRating: number;
  propertyId: number;
  total: 4;
}

export interface ReviewDeleteResponse {
  propertyId: number;
  reviewId: number;
  reviewSummary: ReviewSummary;
}
