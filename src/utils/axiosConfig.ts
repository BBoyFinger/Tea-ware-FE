import axios from "axios";

axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  // baseURL: "https://tea-ceremony-be-zhiv.onrender.com/api",
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
