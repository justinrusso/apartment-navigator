import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  login,
  LoginData,
  register,
  RegistrationData,
  UserData,
} from "../api/auth";
import type { RootState } from ".";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (data: RegistrationData, thunkAPI): Promise<UserData> => {
    let res: Response;
    try {
      res = await register(data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const user: UserData = await res.json();
    return user;
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data: LoginData, thunkAPI): Promise<UserData> => {
    let res: Response;
    try {
      res = await login(data);
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const user: UserData = await res.json();
    return user;
  }
);

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserData | null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (_state, action) => {
      return action.payload;
    });
    builder.addCase(loginUser.fulfilled, (_state, action) => {
      return action.payload;
    });
  },
});

export default userSlice.reducer;

export const selectUser = () => (state: RootState) => state.user;
