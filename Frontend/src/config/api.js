import axios from "axios";

export const API_BASE_URL = "http://localhost:8888/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để luôn lấy token từ localStorage
api.interceptors.request.use((config) => {
  const jwtToken =
    localStorage.getItem("jwt") || localStorage.getItem("access_token");
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }
  return config;
});

export default api;
