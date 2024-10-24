import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getPackagingData,
  getPackagingDataById,
  createPackagingData,
  updatePackagingData,
  deletePackagingData,
  updatePackagingOrderData,
} from "../services/packagingService";

// Read
export const usePackagingData = () => {
  return useQuery("packagingData", getPackagingData);
};

export const usePackagingDataById = (id) => {
  return useQuery(["packagingDataById", id], () => getPackagingDataById(id));
};
// Create
export const useCreatePackagingData = () => {
  const queryClient = useQueryClient();
  return useMutation(createPackagingData, {
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};

// Update
export const useUpdatePackagingData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updatePackagingData(id, data), {
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};

export const useUpdatePackagingOrderData = () => {
  const queryClient = useQueryClient();
  return useMutation((data) => updatePackagingOrderData(data), {
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};

// Delete
export const useDeletePackagingData = () => {
  const queryClient = useQueryClient();
  return useMutation((id) => deletePackagingData(id), {
    onSuccess: () => {
      queryClient.resetQueries();
    },
  });
};
