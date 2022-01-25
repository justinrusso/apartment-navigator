import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { RootState } from ".";
import { PropertyUnitCategory, PropertyUnitsApi } from "../api/units";

const initialState = { categories: [] as PropertyUnitCategory[] };

const unitsSlice = createSlice({
  name: "units",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUnitCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
  },
});

export default unitsSlice.reducer;

export const fetchUnitCategories = createAsyncThunk(
  "units/fetchUnitCategories",
  async (_args, thunkAPI): Promise<PropertyUnitCategory[]> => {
    let res: Response;
    try {
      res = await PropertyUnitsApi.getUnitCategories();
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const resData: { categories: PropertyUnitCategory[] } = await res.json();
    return resData.categories;
  }
);

export const selectUnitCategories = () => (state: RootState) =>
  state.units.categories;
