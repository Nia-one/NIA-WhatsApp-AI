import axios from "axios";

const api = axios.create({
   baseURL: "http://localhost:3000/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;