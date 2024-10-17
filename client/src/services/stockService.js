import apiClient from "./api";

// Create
export const createStockData = async (data) => {
  const response = await apiClient.post("/stock", data);
  return response.data;
};

// Read
export const getStockData = async () => {
  const response = await apiClient.get("/stock");
  return response.data;
};

// Read single
export const getStockDataById = async (id) => {
  const response = await apiClient.get(`/stock/${id}`);
  return response.data;
};

// Update
export const updateStockData = async (id, data) => {
  const response = await apiClient.put(`/stock/${id}`, data);
  return response.data;
};

// Delete
export const deleteStockData = async (id, data) => {
  const response = await apiClient.put(`/stock/delete/${id}`, data);
  return response.data;
};
