import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import api from '../axios';

export const loginInitiated = createAction('auth/loginInitiated');

export const silentRefresh = createAsyncThunk(
  'auth/silentRefresh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/refresh-token', {
        withCredentials: true,
        _silentRefresh: true
      });

      if (!response.data.accessToken || !response.data.user) {
        return rejectWithValue("No valid session");
      }

      return {
        user: response.data.user,
        token: response.data.accessToken,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Session expired");
    }
  }
);


export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials, {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp }, {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Invalid OTP" });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout', {}, { 
        withCredentials: true,
        _skipAuth: true,
        _isLogoutRequest: true
      });
    } catch (err) {
      console.warn("Logout failed:", err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
    pendingVerification: false,
    verificationEmail: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginInitiated, (state, action) => {
        state.pendingVerification = true;
        state.verificationEmail = action.payload.email;
      })
      .addCase(silentRefresh.pending, (state) => {
        state.loading = true;
      })
      .addCase(silentRefresh.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.error = null;
        state.pendingVerification = false;
      })
      .addCase(silentRefresh.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.token = null;
        state.pendingVerification = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
        state.pendingVerification = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload;
        state.pendingVerification = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
        state.pendingVerification = false;
        state.verificationEmail = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.pendingVerification = false;
        state.verificationEmail = null;
      });
  }
});

export default authSlice.reducer;
