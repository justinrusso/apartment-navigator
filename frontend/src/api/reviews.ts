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
