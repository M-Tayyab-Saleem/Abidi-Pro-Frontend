import axios from "axios";
import { toast } from "react-toastify";
import { store } from "./Store";
import { logoutUser, silentRefresh } from "./Store/authSlice";

const api = axios.create({
  baseURL: "http://localhost:4000/api/web",
  withCredentials: true,
  timeout: 10000,
});

let isRefreshingToken = false;

api.interceptors.request.use(
  (config) => {
    const token = store.getState()?.auth?.token;

    if (
      token &&
      !config._silentRefresh &&
      !config._skipAuth &&
      !config._loginRequest &&
      !config._verifyOtp
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip handling for logout requests
    if (originalRequest._isLogoutRequest) {
      return Promise.reject(error);
    }

    // Handle 401 errors (token expired)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshingToken &&
      !originalRequest._skipAuth
    ) {
      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        // Attempt to refresh token
        const response = await api.get("/auth/refresh-token", {
          withCredentials: true,
          _silentRefresh: true,
        });

        isRefreshingToken = false;
        
        // Update store with new token
        store.dispatch({
          type: silentRefresh.fulfilled.type,
          payload: response.data,
        });

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshingToken = false;
        store.dispatch(logoutUser());
        if (!window.location.href.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
