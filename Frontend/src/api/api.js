import axios from "axios";

const api = axios.create({
  baseURL: "https://romantic-happiness-production-b369.up.railway.app/api", // change if deployed
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;