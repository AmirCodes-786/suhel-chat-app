import axios from "axios";

const providedBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = import.meta.env.MODE === "development" 
  ? (providedBaseUrl || "http://localhost:5001/api")
  : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
