import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { register, RegistrationData, UserData } from "../api/auth";
import type { RootState } from ".";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (data: RegistrationData): Promise<UserData> => {
    const res = await register(data);
    const user: UserData = await res.json();
    return user;
  }
);

const initialState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export default userSlice.reducer;

export const selectUser = () => (state: RootState) => state.user;
