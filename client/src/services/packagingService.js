import apiClient from "./api";

// Create
export const createPackagingData = async (data) => {
  const response = await apiClient.post("/packaging", data);
  return response.data;
};

// Read
export const getPackagingData = async () => {
  const response = await apiClient.get("/packaging");
  return response.data;
};

// Read single
export const getPackagingDataById = async (id) => {
  const response = await apiClient.get(`/packaging/${id}`);
  return response.data;
};

// Update
export const updatePackagingData = async (id, data) => {
  const response = await apiClient.put(`/packaging/${id}`, data);
  return response.data;
};

export const updatePackagingOrderData = async (data) => {
  const response = await apiClient.put(`/packaging/order_num`, data);
  return response.data;
};

// Delete
export const deletePackagingData = async (id) => {
  const response = await apiClient.delete(`/packaging/${id}`);
  return response.data;
};
