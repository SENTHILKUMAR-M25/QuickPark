import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("qp_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let waiters = [];

function onRefreshed(token) {
  waiters.forEach((cb) => cb(token));
  waiters = [];
}

async function refreshAccessToken() {
  const { data } = await axios.post(
    `${API_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  localStorage.setItem("qp_access_token", data?.data?.accessToken);
  return data?.data?.accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (status === 401 && !original._retry && !original.url.includes("/auth/login")) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waiters.push((token) => {
            if (token) {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const token = await refreshAccessToken();
        onRefreshed(token);
        localStorage.setItem("qp_access_token", token);
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (refreshError) {
        onRefreshed(null);
        localStorage.removeItem("qp_access_token");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const msg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;
  return Array.isArray(msg) ? msg[0] : msg;
}

export default api;