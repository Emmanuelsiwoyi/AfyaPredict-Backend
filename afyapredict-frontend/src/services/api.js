
import axios from "axios";

const api = axios.create({
  baseURL: "https://afyapredict-backend-production.up.railway.app",
});

export default api;