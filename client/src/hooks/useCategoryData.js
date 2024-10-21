import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getCategoryData,
  getCategoryDataById,
  createCategoryData,
  updateCategoryData,
  deleteCategoryData,
  updateCategoryOrderData,
} from "../services/categoryService";

// Read
export const useCategoryData = () => {
  return useQuery("categoryData", getCategoryData);
};

export const useCategoryDataById = (id) => {
  return useQuery(["categoryDataById", id], () => getCategoryDataById(id));
};
// Create
export const useCreateCategoryData = () => {
  const queryClient = useQueryClient();
  return useMutation(createCategoryData, {
    onSuccess: () => {
      queryClient.invalidateQueries("categoryData");
    },
  });
};

// Update
export const useUpdateCategoryData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updateCategoryData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("categoryData");
    },
  });
};

export const useUpdateCategoryOrderData = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => updateCategoryOrderData(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("categoryData");
    },
  });
};

// Delete
export const useDeleteCategoryData = () => {
  const queryClient = useQueryClient();
  return useMutation((id) => deleteCategoryData(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("categoryData");
    },
  });
};
