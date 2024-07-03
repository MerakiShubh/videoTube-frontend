import axios from "axios";
import Cookies from "js-cookie";
axios.defaults.withCredentials = true;
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
      if (!refreshToken) {
        // If refresh token is missing, handle accordingly
        Cookies.remove("accessToken");
        window.location.href = "/signin"; // Redirect to login or handle appropriately
        return Promise.reject(error);
      }
      try {
        const { data } = await api.post("/api/v1/users/refresh-token", {
          refreshToken,
        });
        const { accessToken } = data;
        Cookies.set("accessToken", accessToken, { secure: false }); // Set secure to false for local development

        // Update headers
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login"; // Redirect to login or handle appropriately
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const register = async (formData) =>
  api.post("/api/v1/users/register", formData);

export const login = async (data) => api.post("/api/v1/users/login", data);

export const fetchVideos = async (params = {}) => {
  const response = await api.get("/api/v1/videos", { params });
  return response.data.result.videos;
};

export const fetchVideosById = async (videoId) => {
  const response = await api.get(`/api/v1/videos/${videoId}`);
  return response.data.data;
};

export const fetchVideosByCategory = async (tag) => {
  const response = await api.get(`api/v1/videos/tag/${tag}`);
  console.log("here is the response for category videos", response.data.data);
  return response.data.data;
};

export const uploadVideo = async (data) => {
  const response = await api.post("/api/v1/videos", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

export const addComment = async (videoId, content) => {
  const response = await api.post(`api/v1/comments/${videoId}`, { content });
  return response.data.data;
};

export const fetchComments = async (videoId) => {
  const response = await api.get(`api/v1/comments/${videoId}`, {
    params: { page: 1, limit: 10 },
  });
  return response.data.data.comments;
};

export const updateComment = async (commentId, content) => {
  const response = await api.patch(`api/v1/comments/c/${commentId}`, {
    content,
  });
  return response.data.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`api/v1/comments/c/${commentId}`);
  return response;
};

export const videoLike = async (videoId) => {
  const response = await api.post(`api/v1/likes/toggle/v/${videoId}`);
  return response;
};

export const getLikedVideos = async () => {
  const response = await api.get(`api/v1/likes/videos`);
  console.log("here is response", response.data.data);
  return response.data.data;
};

export const incrementViewCount = async (videoId) => {
  const response = await api.post(`/api/v1/videos/increment-views/${videoId}`);
  return response.data;
};
