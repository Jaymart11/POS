import apiClient from "./api";

// Create
export const createExpenseData = async (data) => {
  const response = await apiClient.post("/expense", data);
  return response.data;
};

// Read
export const getExpenseData = async () => {
  const response = await apiClient.get("/expense");
  return response.data;
};

// Read single
export const getExpenseDataById = async (id) => {
  const response = await apiClient.get(`/expense/${id}`);
  return response.data;
};

// Update
export const updateExpenseData = async (id, data) => {
  const response = await apiClient.put(`/expense/${id}`, data);
  return response.data;
};

// Delete
export const deleteExpenseData = async (id) => {
  const response = await apiClient.delete(`/expense/${id}`);
  return response.data;
};
