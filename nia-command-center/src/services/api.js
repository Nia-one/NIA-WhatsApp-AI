import axios from "axios";

const api = axios.create({
    baseURL: "https://nia-whatsapp-ai.onrender.com/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;