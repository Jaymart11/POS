import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getOrderData,
  getOrderDataById,
  createOrderData,
  updateOrderData,
  deleteOrderData,
} from "../services/orderService";

// Read
export const useOrderData = () => {
  return useQuery("orderData", getOrderData);
};

export const useOrderDataById = (id) => {
  return useQuery(["orderDataById", id], () => getOrderDataById(id));
};
// Create
export const useCreateOrderData = () => {
  const queryClient = useQueryClient();
  return useMutation(createOrderData, {
    onSuccess: () => {
      queryClient.invalidateQueries("orderData");
      queryClient.invalidateQueries("productData");
    },
  });
};

// Update
export const useUpdateOrderData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updateOrderData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("orderData");
      queryClient.invalidateQueries("productData");
    },
  });
};

// Delete
export const useDeleteOrderData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => deleteOrderData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("orderData");
      queryClient.invalidateQueries("productData");
    },
  });
};
