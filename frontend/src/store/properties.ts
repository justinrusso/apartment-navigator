import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalize } from "normalizr";

import {
  CreatePropertyData,
  getPropertyCategories,
  PropertiesApi,
  PropertiesApiData,
  PropertyApiData,
  PropertyCategoryData,
  PropertyImage,
  PropertyUnit,
  UpdatePropertyData,
} from "../api/properties";
import type { RootState } from ".";
import {
  NormalizedProperty,
  NormalizedPropertyUnit,
  propertiesSchema,
  propertyCategoryArraySchema,
  propertySchema,
  propertyUnitSchema,
} from "./normalizers/properties";
import { NormalizedResult } from "./normalizers";
import { UsersApi } from "../api/users";
import { ImagesApi } from "../api/images";
import {
  CreatePropertyUnitData,
  PropertyUnitsApi,
  UpdatePropertyUnitData,
} from "../api/units";
import {
  EditableReviewData,
  ReviewData,
  ReviewDeleteResponse,
  ReviewsApi,
  ReviewSummary,
} from "../api/reviews";
import { reviewsSchema } from "./normalizers/reviews";

const initialState = {
  categories: {
    entities: {} as Record<number, PropertyCategoryData>,
    ids: [] as number[],
  },
  entities: {} as Record<number, NormalizedProperty>,
  ids: [] as number[],
  images: {} as Record<number, PropertyImage>,
  reviews: {} as Record<number, ReviewData>,
  units: {} as Record<number, NormalizedPropertyUnit>,
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPropertyCategories.fulfilled, (state, action) => {
      state.categories.entities = action.payload.entities.categories;
      state.categories.ids = Array.isArray(action.payload.result)
        ? action.payload.result
        : [action.payload.result];
    });
    builder.addCase(addProperty.fulfilled, (state, action) => {
      state.entities[action.payload.result as number] =
        action.payload.entities.properties[action.payload.result as number];
      state.ids.push(action.payload.result as number);
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.entities = action.payload.entities.properties;
      state.ids = Array.isArray(action.payload.result)
        ? action.payload.result
        : [action.payload.result];
      state.images = action.payload.entities.images;
      state.units = action.payload.entities.units;
    });
    builder.addCase(fetchUserOwnedProperties.fulfilled, (state, action) => {
      state.entities = action.payload.entities.properties;
      state.ids = Array.isArray(action.payload.result)
        ? action.payload.result
        : [action.payload.result];
      state.images = action.payload.entities.images;
      state.units = action.payload.entities.units;
    });
    builder.addCase(fetchProperty.fulfilled, (state, action) => {
      const propertyId = action.payload.result as number;
      state.ids.push(propertyId);
      state.entities = {
        ...state.entities,
        ...action.payload.entities.properties,
      };
      state.images = {
        ...state.images,
        ...action.payload.entities.images,
      };
      state.units = {
        ...state.units,
        ...action.payload.entities.units,
      };
    });

    builder.addCase(editProperty.fulfilled, (state, action) => {
      const propertyId = action.payload.result as number;
      state.entities[propertyId] =
        action.payload.entities.properties[propertyId];
    });

    builder.addCase(deleteProperty.fulfilled, (state, action) => {
      const propertyId = action.payload;
      const property = state.entities[propertyId];

      property.images.forEach((imageId) => {
        delete state.images[imageId];
      });
      property.units.forEach((unitId) => {
        delete state.units[unitId];
      });
      state.ids = state.ids.filter((id) => id !== propertyId);
      delete state.entities[propertyId];
    });

    builder.addCase(addPropertyImage.fulfilled, (state, action) => {
      state.images[action.payload.id] = action.payload;
      state.entities[action.payload.propertyId].images.push(action.payload.id);
      if (action.payload.unitId) {
        state.units[action.payload.unitId].images.push(action.payload.id);
      }
    });

    builder.addCase(deletePropertyImage.fulfilled, (state, action) => {
      const deletedImageId = action.payload;
      const image = state.images[deletedImageId];
      const property = state.entities[image.propertyId];

      delete state.images[deletedImageId];

      property.images = property.images.filter(
        (imageId) => imageId !== deletedImageId
      );

      if (image.unitId) {
        state.units[image.unitId].images.filter(
          (imageId) => imageId !== deletedImageId
        );
      }
    });

    builder.addCase(addPropertyUnit.fulfilled, (state, action) => {
      const unitId = action.payload.result as number;
      const unit = action.payload.entities.units[unitId];

      state.units[unitId] = unit;
      state.entities[unit.propertyId]?.units.push(unitId);
    });

    builder.addCase(updatePropertyUnit.fulfilled, (state, action) => {
      const unitId = action.payload.result as number;
      const unit = action.payload.entities.units[unitId];

      state.units[unitId] = unit;
    });

    builder.addCase(deletePropertyUnit.fulfilled, (state, action) => {
      const deletedUnitId = action.payload;
      const unit = state.units[deletedUnitId];
      const property = state.entities[unit.propertyId];

      unit.images.forEach((imageId) => {
        delete state.images[imageId];
      });
      const imagesToDelete = new Set(unit.images);
      property.images = property.images.filter(
        (imageId) => !imagesToDelete.has(imageId)
      );

      property.units = property.units.filter(
        (unitId) => unitId !== deletedUnitId
      );

      delete state.units[deletedUnitId];
    });

    builder.addCase(fetchPropertyReviews.fulfilled, (state, action) => {
      const property = state.entities[action.payload.propertyId];
      if (!property) {
        // If there is no property for these reviews, why add it?
        return;
      }
      property.reviews = action.payload.result;
      state.reviews = action.payload.reviews;
    });

    builder.addCase(addPropertyReview.fulfilled, (state, action) => {
      const propertyId =
        typeof action.payload.propertyId === "string"
          ? parseInt(action.payload.propertyId, 10) || 0
          : action.payload.propertyId;
      const property = state.entities[propertyId];
      if (!property) {
        // If there is no property for the reviews, why add it?
        return;
      }
      property.reviews?.unshift(action.payload.review.id);
      property.reviewSummary = action.payload.reviewSummary;
      state.reviews[action.payload.review.id] = action.payload.review;
    });

    builder.addCase(editPropertyReview.fulfilled, (state, action) => {
      const propertyId = action.payload.review.propertyId;
      const property = state.entities[propertyId];
      if (!property) {
        // If there is no property for the reviews, why add it?
        return;
      }
      property.reviews = property.reviews?.filter(
        (id) => id !== action.payload.review.id
      );
      property.reviews?.unshift(action.payload.review.id);
      property.reviewSummary = action.payload.reviewSummary;
      state.reviews[action.payload.review.id] = action.payload.review;
    });

    builder.addCase(deletePropertyReview.fulfilled, (state, action) => {
      const propertyId = action.payload.propertyId;
      const reviewId = action.payload.reviewId;
      const property = state.entities[propertyId];
      if (!property) {
        // If there is no property for the reviews, why add it?
        return;
      }
      property.reviews = property.reviews?.filter((id) => id !== reviewId);
      property.reviewSummary = action.payload.reviewSummary;
      delete state.reviews[reviewId];
    });
  },
});

type FetchPropertyCategoriesResult = NormalizedResult<
  { categories: Record<string, PropertyCategoryData> },
  number
>;
export const fetchPropertyCategories = createAsyncThunk(
  `${propertiesSlice.name}/fetchPropertyCategories`,
  async (args, thunkAPI): Promise<FetchPropertyCategoriesResult> => {
    let res: Response;
    try {
      res = await getPropertyCategories();
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const resData: { categories: PropertyCategoryData[] } = await res.json();
    const normalizedData: FetchPropertyCategoriesResult = normalize(
      resData.categories,
      propertyCategoryArraySchema
    );
    return normalizedData;
  }
);

export const selectPropertyCategoryIds = () => (state: RootState) =>
  state.properties.categories.ids;
export const selectPropertyCategories = () => (state: RootState) =>
  state.properties.categories.entities;
export const selectPropertyCategoriesArray = () => (state: RootState) =>
  Object.values(state.properties.categories.entities);
export const selectPropertyCategory = (id: number) => (state: RootState) =>
  state.properties.categories.entities[id];

type AddPropertyResult = NormalizedResult<
  {
    properties: Record<number, NormalizedProperty>;
  },
  number
>;
export const addProperty = createAsyncThunk(
  `${propertiesSlice.name}/addProperty`,
  async (data: CreatePropertyData, thunkAPI): Promise<AddPropertyResult> => {
    let res: Response;
    try {
      res = await PropertiesApi.createProperty(data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const resData: PropertyApiData = await res.json();
    const normalizedData: AddPropertyResult = normalize(
      resData,
      propertySchema
    );
    return normalizedData;
  }
);

type EditPropertyData = { id: number } & UpdatePropertyData;
export const editProperty = createAsyncThunk(
  `${propertiesSlice.name}/editProperty`,
  async (data: EditPropertyData, thunkAPI): Promise<AddPropertyResult> => {
    let res: Response;
    try {
      res = await PropertiesApi.updateProperty(data.id, data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const resData: PropertyApiData = await res.json();
    const normalizedData: AddPropertyResult = normalize(
      resData,
      propertySchema
    );
    return normalizedData;
  }
);

type FetchPropertiesResult = NormalizedResult<
  {
    images: Record<number, PropertyImage>;
    properties: Record<number, NormalizedProperty>;
    units: Record<number, NormalizedPropertyUnit>;
  },
  number
>;
export const fetchProperties = createAsyncThunk(
  `${propertiesSlice.name}/fetchProperties`,
  async (args, thunkAPI): Promise<FetchPropertiesResult> => {
    let res: Response;
    try {
      res = await PropertiesApi.getProperties();
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const resData: PropertiesApiData = await res.json();
    const normalizedData: FetchPropertiesResult = normalize(
      resData.properties,
      propertiesSchema
    );
    return normalizedData;
  }
);

export const fetchUserOwnedProperties = createAsyncThunk(
  `${propertiesSlice.name}/fetchUserOwnedProperties`,
  async (_args, thunkAPI): Promise<FetchPropertiesResult> => {
    let res: Response;
    try {
      res = await UsersApi.getUserOwnedProperties();
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const resData: PropertiesApiData = await res.json();
    const normalizedData: FetchPropertiesResult = normalize(
      resData.properties,
      propertiesSchema
    );
    return normalizedData;
  }
);

interface FetchPropertyArgs {
  propertyId: number | string;
}
export const fetchProperty = createAsyncThunk(
  `${propertiesSlice.name}/fetchProperty`,
  async (
    { propertyId }: FetchPropertyArgs,
    thunkAPI
  ): Promise<FetchPropertiesResult> => {
    let res: Response;
    try {
      res = await PropertiesApi.getProperty(propertyId);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const resData: PropertyApiData = await res.json();
    const normalizedData: FetchPropertiesResult = normalize(
      resData,
      propertySchema
    );
    return normalizedData;
  }
);

export const selectPropertyIds = () => (state: RootState) =>
  state.properties.ids;
export const selectProperties = () => (state: RootState) =>
  state.properties.entities;
export const selectPropertiesArray = () => (state: RootState) =>
  Object.values(state.properties.entities);
export const selectProperty =
  (id: number) =>
  (state: RootState): NormalizedProperty | undefined =>
    state.properties.entities[id];

export const selectPropertyImages =
  (imageIds: number[]) => (state: RootState) =>
    imageIds.map((imageId) => state.properties.images[imageId]);
export const selectPropertyImage = (imageId?: number) => (state: RootState) =>
  imageId !== undefined ? state.properties.images[imageId] : undefined;

export const selectPropertyUnit = (unitId: number) => (state: RootState) =>
  state.properties.units[unitId];
export const selectPropertyUnits = (propertyId: number) => (state: RootState) =>
  state.properties.entities[propertyId]?.units.map(
    (unitId) => state.properties.units[unitId]
  ) || [];
export const selectPropertyUnitsByCategories =
  (propertyId: number) => (state: RootState) => {
    if (!state.properties.entities[propertyId]) {
      return;
    }
    const unitIds = state.properties.entities[propertyId].units;
    const unitCategoryMap: Record<number, NormalizedPropertyUnit[]> = {};

    unitIds.forEach((unitId) => {
      const unit = state.properties.units[unitId];
      if (!unitCategoryMap[unit.unitCategory.id]) {
        unitCategoryMap[unit.unitCategory.id] = [];
      }
      unitCategoryMap[unit.unitCategory.id].push(unit);
    });

    return unitCategoryMap;
  };

export const deleteProperty = createAsyncThunk(
  `${propertiesSlice.name}/deleteProperty`,
  async ({ propertyId }: FetchPropertyArgs, thunkAPI): Promise<number> => {
    let res: Response;
    try {
      res = await PropertiesApi.deleteProperty(propertyId);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: { id: number } = await res.json();
    return resData.id;
  }
);

interface AddPropertyImageArgs {
  propertyId: number | string;
  imageUrl: string;
}
export const addPropertyImage = createAsyncThunk(
  `${propertiesSlice.name}/addPropertyImage`,
  async (data: AddPropertyImageArgs, thunkAPI): Promise<PropertyImage> => {
    let res: Response;
    try {
      res = await PropertiesApi.createPropertyImage(data.propertyId, {
        imageUrl: data.imageUrl,
      });
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: PropertyImage = await res.json();
    return resData;
  }
);

interface DeletePropertyImageArgs {
  imageId: number;
}
export const deletePropertyImage = createAsyncThunk(
  `${propertiesSlice.name}/deletePropertyImage`,
  async ({ imageId }: DeletePropertyImageArgs, thunkAPI): Promise<number> => {
    try {
      await ImagesApi.deleteImage(imageId);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    return imageId;
  }
);

interface AddPropertyUnitArgs {
  propertyId: number;
  data: CreatePropertyUnitData;
}
export const addPropertyUnit = createAsyncThunk(
  `${propertiesSlice.name}/addPropertyUnit`,
  async (
    { propertyId, data }: AddPropertyUnitArgs,
    thunkAPI
  ): Promise<
    NormalizedResult<{ units: Record<string, NormalizedPropertyUnit> }, number>
  > => {
    let res: Response;
    try {
      res = await PropertiesApi.createPropertyUnit(propertyId, data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: PropertyUnit = await res.json();
    return normalize(resData, propertyUnitSchema);
  }
);

interface CreatePropertyUnitArgs {
  unitId: number;
  data: UpdatePropertyUnitData;
}
export const updatePropertyUnit = createAsyncThunk(
  `${propertiesSlice.name}/updatePropertyUnit`,
  async (
    { unitId, data }: CreatePropertyUnitArgs,
    thunkAPI
  ): Promise<
    NormalizedResult<{ units: Record<string, NormalizedPropertyUnit> }, number>
  > => {
    let res: Response;
    try {
      res = await PropertyUnitsApi.updateUnit(unitId, data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: PropertyUnit = await res.json();
    return normalize(resData, propertyUnitSchema);
  }
);

interface DeletePropertyUnitArgs {
  unitId: number;
}
export const deletePropertyUnit = createAsyncThunk(
  `${propertiesSlice.name}/deletePropertyUnit`,
  async ({ unitId }: DeletePropertyUnitArgs, thunkAPI): Promise<number> => {
    try {
      await PropertyUnitsApi.deleteUnit(unitId);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    return unitId;
  }
);

type PropertyReviewsResult = {
  propertyId: number;
  reviews: Record<string, ReviewData>;
  result: number[];
};
export const fetchPropertyReviews = createAsyncThunk(
  `${propertiesSlice.name}/fetchPropertyReviews`,
  async (
    { propertyId }: FetchPropertyArgs,
    thunkAPI
  ): Promise<PropertyReviewsResult> => {
    let res: Response;
    try {
      res = await PropertiesApi.getPropertyReviews(propertyId);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: { id: number; reviews: ReviewData[] } = await res.json();
    const normalizedData: NormalizedResult<
      {
        reviews: Record<number, ReviewData>;
      },
      number
    > = normalize(resData.reviews, reviewsSchema);
    return {
      propertyId: propertyId as number,
      reviews: normalizedData.entities.reviews,
      result: normalizedData.result as number[],
    };
  }
);

export const selectPropertyReviewsArray =
  (propertyId: number) => (state: RootState) => {
    const propertyReviewIds = state.properties.entities[propertyId]?.reviews;
    if (!propertyReviewIds) {
      return [];
    }
    return propertyReviewIds
      .map((reviewId) => state.properties.reviews[reviewId])
      .filter(Boolean);
  };

export const addPropertyReview = createAsyncThunk(
  `${propertiesSlice.name}/addPropertyReview`,
  async (
    { propertyId, data }: FetchPropertyArgs & { data: EditableReviewData },
    thunkAPI
  ): Promise<{
    propertyId: number | string;
    review: ReviewData;
    reviewSummary: ReviewSummary;
  }> => {
    let res: Response;
    try {
      res = await PropertiesApi.createPropertyReview(propertyId, data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: { review: ReviewData; reviewSummary: ReviewSummary } =
      await res.json();
    return {
      propertyId,
      review: resData.review,
      reviewSummary: resData.reviewSummary,
    };
  }
);

export const editPropertyReview = createAsyncThunk(
  `${propertiesSlice.name}/editPropertyReview`,
  async (
    { reviewId, data }: { reviewId: number; data: Partial<EditableReviewData> },
    thunkAPI
  ): Promise<{
    review: ReviewData;
    reviewSummary: ReviewSummary;
  }> => {
    let res: Response;
    try {
      res = await ReviewsApi.updatePropertyReview(reviewId, data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: { review: ReviewData; reviewSummary: ReviewSummary } =
      await res.json();
    return {
      review: resData.review,
      reviewSummary: resData.reviewSummary,
    };
  }
);

export const selectPropertyReview = (reviewId: number) => (state: RootState) =>
  state.properties.reviews[reviewId];

export const deletePropertyReview = createAsyncThunk(
  `${propertiesSlice.name}/deletePropertyReview`,
  async (
    { reviewId }: { reviewId: number },
    thunkAPI
  ): Promise<ReviewDeleteResponse> => {
    let res: Response;
    try {
      res = await ReviewsApi.deletePropertyReview(reviewId);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.error || resData.errors);
    }
    const resData: ReviewDeleteResponse = await res.json();
    return {
      propertyId: resData.propertyId,
      reviewId: resData.reviewId,
      reviewSummary: resData.reviewSummary,
    };
  }
);

export default propertiesSlice.reducer;
