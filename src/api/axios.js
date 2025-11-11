// src/api/axios.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export const api = axios.create({
  baseURL: "/api", // <-- KEY: goes through Vite proxy
  withCredentials: true, // if you set cookies
  headers: { "Content-Type": "application/json" },
});
