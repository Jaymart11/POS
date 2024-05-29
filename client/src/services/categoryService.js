import apiClient from "./api";

// Create
export const createCategoryData = async (data) => {
  const response = await apiClient.post("/categories", data);
  return response.data;
};

// Read
export const getCategoryData = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

// Read single
export const getCategoryDataById = async (id) => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};

// Update
export const updateCategoryData = async (id, data) => {
  const response = await apiClient.put(`/categories/${id}`, data);
  return response.data;
};

// Delete
export const deleteCategoryData = async (id) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};
