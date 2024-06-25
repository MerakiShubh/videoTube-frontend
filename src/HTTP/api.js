import axios from "axios";

const registerApi = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const register = async (formData) =>
  registerApi.post("/api/v1/users/register", formData);

const loginApi = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => loginApi.post("/api/v1/users/login", data);
console.log("here is login", login);
