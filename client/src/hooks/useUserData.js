import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getUserData,
  getUserDataById,
  createUserData,
  updateUserData,
  deleteUserData,
  getCashierData,
} from "../services/userService";

// Read
export const useUserData = () => {
  return useQuery("userData", getUserData);
};

export const useCashierData = () => {
  return useQuery("cashierData", getCashierData);
};

export const useUserDataById = (id) => {
  return useQuery(["userDataById", id], () => getUserDataById(id));
};
// Create
export const useCreateUserData = () => {
  const queryClient = useQueryClient();
  return useMutation(createUserData, {
    onSuccess: () => {
      queryClient.invalidateQueries("userData");
    },
  });
};

// Update
export const useUpdateUserData = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => updateUserData(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("userData");
    },
  });
};

// Delete
export const useDeleteUserData = () => {
  const queryClient = useQueryClient();
  return useMutation((id) => deleteUserData(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("userData");
    },
  });
};
