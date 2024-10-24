import axios from "axios";

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
