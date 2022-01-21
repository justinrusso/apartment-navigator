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
} from "../api/properties";
import type { RootState } from ".";
import {
  NormalizedProperty,
  NormalizedPropertyUnit,
  propertiesSchema,
  propertyCategoryArraySchema,
  propertySchema,
} from "./normalizers/properties";
import { NormalizedResult } from "./normalizers";

const initialState = {
  categories: {
    entities: {} as Record<number, PropertyCategoryData>,
    ids: [] as number[],
  },
  entities: {} as Record<number, NormalizedProperty>,
  ids: [] as number[],
  images: {} as Record<number, PropertyImage>,
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

export const selectPropertyIds = () => (state: RootState) =>
  state.properties.ids;
export const selectProperties = () => (state: RootState) =>
  state.properties.entities;
export const selectPropertiesArray = () => (state: RootState) =>
  Object.values(state.properties.entities);
export const selectProperty = (id: number) => (state: RootState) =>
  state.properties.entities[id];

export const selectPropertyImage = (imageId?: number) => (state: RootState) =>
  imageId !== undefined ? state.properties.images[imageId] : undefined;

export default propertiesSlice.reducer;
