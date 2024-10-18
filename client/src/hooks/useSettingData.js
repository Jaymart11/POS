import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getSettingData,
  getSettingDataById,
  createSettingData,
  updateSettingData,
  deleteSettingData,
} from "../services/settingService";

// Read
export const useSettingData = () => {
  return useQuery("settingData", getSettingData);
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
