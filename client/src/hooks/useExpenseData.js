import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getExpenseData,
  getExpenseDataById,
  createExpenseData,
  updateExpenseData,
  deleteExpenseData,
} from "../services/expenseService";

// Read
export const useExpenseData = () => {
  return useQuery("expenseData", getExpenseData);
};

export const useExpenseDataById = (id) => {
  return useQuery(["expenseDataById", id], () => getExpenseDataById(id));
};
// Create
export const useCreateExpenseData = () => {
  const queryClient = useQueryClient();
  return useMutation(createExpenseData, {
    onSuccess: () => {
      queryClient.invalidateQueries("expenseData");
    },
  });
};

// Update
export const useUpdateExpenseData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updateExpenseData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("expenseData");
    },
  });
};

// Delete
export const useDeleteExpenseData = () => {
  const queryClient = useQueryClient();
  return useMutation((id) => deleteExpenseData(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("expenseData");
    },
  });
};
