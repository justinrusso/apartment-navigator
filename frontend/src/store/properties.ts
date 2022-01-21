import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { normalize } from "normalizr";

import { getPropertyCategories, PropertyCategoryData } from "../api/properties";
import type { RootState } from ".";
import { propertyCategoryArraySchema } from "./normalizers/properties";
import { NormalizedResult } from "./normalizers";

const initialState = {
  categories: {
    entities: {} as Record<number, PropertyCategoryData>,
    ids: [] as number[],
  },
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

export default propertiesSlice.reducer;
