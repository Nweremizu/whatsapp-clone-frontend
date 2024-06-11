import axios from "axios";

const instance = axios.create({
  baseURL: process.env.BACKEND,
  withCredentials: true,
});

export function setupAxiosInterceptors(isLoggedIn) {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (isLoggedIn) {
        try {
          const response = await axios.post(
            process.env.BACKEND + "/auth/refreshToken",
            {},
            {
              withCredentials: true,
            }
          );
          if (response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken.token);
            return instance(originalRequest);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default instance;
