import axios from "axios";

const api = axios.create({
  baseURL: "https://romantic-happiness-production-b369.up.railway.app/api",
  withCredentials: true,
});

export default api;