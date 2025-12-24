import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 IMPORTANT: login/register pe token mat bhejo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  const isAuthRoute =
    config.url.includes("/accounts/login/") ||
    config.url.includes("/accounts/register/");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
