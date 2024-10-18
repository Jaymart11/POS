import apiClient from "./api";

// Create
export const createSettingData = async (data) => {
  const response = await apiClient.post("/setting", data);
  return response.data;
};

export const getLowQuantityData = async () => {
  const response = await apiClient.get("/setting/low_quantity");
  return response.data;
};

// Read
export const getSettingData = async () => {
  const response = await apiClient.get("/setting");
  return response.data;
};

// Read single
export const getSettingDataById = async (id) => {
  const response = await apiClient.get(`/setting/${id}`);
  return response.data;
};

// Update
export const updateSettingData = async (id, data) => {
  const response = await apiClient.put(`/setting/${id}`, data);
  return response.data;
};

// Delete
export const deleteSettingData = async (id) => {
  const response = await apiClient.delete(`/setting/${id}`);
  return response.data;
};
