import apiClient from "./api";

// Create
export const createUserData = async (data) => {
  const response = await apiClient.post("/users", data);
  return response.data;
};

// Read
export const getUserData = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

// Read single
export const getUserDataById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// Update
export const updateUserData = async (id, data) => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
};

// Delete
export const deleteUserData = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const userLogin = async (data) => {
  const response = await apiClient.post(`/users/login`, data);
  return response.data;
};
