import axios from "axios";
import toast from "react-hot-toast";

const _axios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

let isRedirecting = false;

_axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.name === "TokenExpiredError" &&
      !isRedirecting &&
      window.location.pathname !== "/login"
    ) {
      isRedirecting = true;

      toast.error("Session expired. Please login again.");

      window.location.href = "/login";

      setTimeout(() => {
        isRedirecting = false;
      }, 1000);
    }
    return Promise.reject(error);
  },
);

export default _axios;
