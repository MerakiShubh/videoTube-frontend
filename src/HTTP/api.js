import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const register = async (formData) =>
  api.post("/api/v1/users/register", formData);

export const login = async (data) => api.post("/api/v1/users/login", data);
