import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  login,
  LoginData,
  loginDemo,
  signup,
  SignupData,
  UserData,
} from "../api/auth";
import type { RootState } from ".";

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (data: SignupData, thunkAPI): Promise<UserData> => {
    let res: Response;
    try {
      res = await signup(data);
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

export const loginDemoUser = createAsyncThunk(
  "user/loginDemoUser",
  async (args, thunkAPI): Promise<UserData> => {
    let res: Response;
    try {
      res = await loginDemo();
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const user: UserData = await res.json();
    return user;
  }
);

export const authenticateUser = createAsyncThunk(
  "user/authenticateUser",
  async (args, thunkAPI): Promise<UserData> => {
    let res: Response;
    try {
      res = await loginDemo();
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
    const user: UserData = await res.json();
    return user;
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (args, thunkAPI): Promise<void> => {
    try {
      await loginDemo();
    } catch (errorRes) {
      const resData = await (errorRes as Response).json();
      throw thunkAPI.rejectWithValue(resData.errors);
    }
  }
);

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState: initialState as UserData | null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signupUser.fulfilled, (_state, action) => {
      return action.payload;
    });
    builder.addCase(loginUser.fulfilled, (_state, action) => {
      return action.payload;
    });
    builder.addCase(loginDemoUser.fulfilled, (_state, action) => {
      return action.payload;
    });
    builder.addCase(authenticateUser.fulfilled, (_state, action) => {
      if (action.payload?.id) {
        return action.payload;
      }
    });
    builder.addCase(logoutUser.fulfilled, () => {
      return null;
    });
  },
});

export default userSlice.reducer;

export const selectUser = () => (state: RootState) => state.user;
