import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getProductData,
  getProductDataById,
  createProductData,
  updateProductData,
  deleteProductData,
  updateProductOrderData,
} from "../services/productService";

// Read
export const useProductData = (categoryId) => {
  return useQuery(
    ["productData", categoryId],
    async () => await getProductData(categoryId)
  );
};

export const useProductDataById = (id) => {
  return useQuery(["productDataById", id], () => getProductDataById(id));
};
// Create
export const useCreateProductData = () => {
  const queryClient = useQueryClient();
  return useMutation(createProductData, {
    onSuccess: () => {
      queryClient.invalidateQueries("productData");
    },
  });
};

// Update
export const useUpdateProductData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updateProductData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("productData");
    },
  });
};

export const useUpdateProductOrderData = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => updateProductOrderData(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("productData");
    },
  });
};

// Delete
export const useDeleteProductData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => deleteProductData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("productData");
    },
  });
};
