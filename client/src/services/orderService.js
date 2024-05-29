import apiClient from "./api";

// Create
export const createOrderData = async (data) => {
  const response = await apiClient.post("/orders", data);
  return response.data;
};

// Read
export const getOrderData = async () => {
  const response = await apiClient.get("/orders");
  return response.data;
};

// Read single
export const getOrderDataById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

// Update
export const updateOrderData = async (id, data) => {
  const response = await apiClient.put(`/orders/${id}`, data);
  return response.data;
};

// Delete
export const deleteOrderData = async (id) => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};

export const downloadReport = async () => {
  try {
    const response = await apiClient.get(`/orders/report`, {
      responseType: "blob", // Important for file download
    });

    // Create a link element, set the href to the blob URL, and click it to start the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `order.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading the order data:", error);
    throw error;
  }
};
