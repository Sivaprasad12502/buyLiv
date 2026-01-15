import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized & not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          logoutUser();
          return Promise.reject(error);
        }

        // 🔥 Refresh token request (NO axiosClient to avoid loop)
        const res = await axios.post(
          `${API_BASE_URL}/api/accounts/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = res.data.access;

        // Save new token
        localStorage.setItem("access_token", newAccessToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* ================= LOGOUT HELPER ================= */
function logoutUser() {
  localStorage.clear();
  window.location.href = "/login";
}

export default axiosClient;
