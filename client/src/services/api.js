import axios from "axios";

const API_URL = "http://192.168.68.109:3000"; // Replace with your API URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
