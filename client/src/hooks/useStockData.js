import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getStockData,
  getStockDataById,
  createStockData,
  updateStockData,
  deleteStockData,
} from "../services/stockService";

// Read
export const useStockData = () => {
  return useQuery("stockData", getStockData);
};

export const useStockDataById = (id) => {
  return useQuery(["stockDataById", id], () => getStockDataById(id));
};
// Create
export const useCreateStockData = () => {
  const queryClient = useQueryClient();
  return useMutation(createStockData, {
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};

// Update
export const useUpdateStockData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updateStockData(id, data), {
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};

// Delete
export const useDeleteStockData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => deleteStockData(id, data), {
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};
