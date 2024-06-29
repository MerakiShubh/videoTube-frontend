import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");
      try {
        const { data } = await api.post("/api/v1/users/refresh-token", {
          refreshToken,
        });
        const { accessToken } = data;
        Cookies.set("accessToken", accessToken, {
          secure: true,
          httpOnly: true,
        });
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        // Redirect to login page or handle appropriately
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const register = async (formData) =>
  api.post("/api/v1/users/register", formData);

export const login = async (data) => api.post("/api/v1/users/login", data);
export const fetchVideos = async () => {
  const response = await api.get("/api/v1/videos", {
    params: { page: 1, limit: 10 },
  });
  return response.data.result.videos;
};

export const fetchVideosById = async (videoId) => {
  const response = await api.get(`/api/v1/videos/${videoId}`);
  console.log("here is response", response);
  return response.data.data;
};
