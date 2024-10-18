import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getSettingData,
  getSettingDataById,
  createSettingData,
  updateSettingData,
  deleteSettingData,
  getLowQuantityData,
} from "../services/settingService";

// Read
export const useSettingData = () => {
  return useQuery("settingData", getSettingData);
};

export const useLowQuantityData = () => {
  return useQuery("lowQuantity", getLowQuantityData);
};

export const useSettingDataById = (id) => {
  return useQuery(["settingDataById", id], () => getSettingDataById(id));
};
// Create
export const useCreateSettingData = () => {
  const queryClient = useQueryClient();
  return useMutation(createSettingData, {
    onSuccess: () => {
      queryClient.invalidateQueries("settingData");
    },
  });
};

// Update
export const useUpdateSettingData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updateSettingData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("settingData");
      queryClient.invalidateQueries("lowQuantity");
    },
  });
};

// Delete
export const useDeleteSettingData = () => {
  const queryClient = useQueryClient();
  return useMutation((id) => deleteSettingData(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("settingData");
    },
  });
};
