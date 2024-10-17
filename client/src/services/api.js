import axios from "axios";

const API_URL = "https://tryusisig.store"; // Replace with your API URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
