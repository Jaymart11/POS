import axios from "axios";

const API_URL = "http://13.250.108.119:3002"; // Replace with your API URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
