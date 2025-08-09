import axios from "axios"; // must be lowercase 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export default instance;
