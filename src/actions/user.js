import axios from "axios";
import axiosInstance, { axiosFormdataInstance } from "./api";
import { toast } from "react-toastify";

export const handleCreateUser = async (formData, onSuccess) => {
  try {
    const response = await axiosInstance.post("/api/users/create", formData);
    toast.success("User added successfully!");
    onSuccess(response.data.user);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
      console.log('error :>> ', error);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdateUser = async (id, formData, onSuccess) => {
  try {
    const response = await axiosInstance.put(
      `/api/users/update/${id}`,
      formData
    );
    toast.success("User updated successfully!");
    onSuccess(response.data.user);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users");
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/all");
    return response.data.user;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetUserData = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/users/one?id=${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteUser = async (id, onSuccess) => {
  try {
    await axiosInstance.delete(`/api/users/delete/${id}`);
    toast.success("User deleted successfully!");
    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
