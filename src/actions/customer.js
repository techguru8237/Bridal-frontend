import axiosInstance, { axiosFormdataInstance } from "./api";
import { toast } from "react-toastify";

export const handleCreateCustomer = async (formData, onSuccess) => {
  try {
    const response = await axiosInstance.post(
      "/api/customers/create",
      formData
    );
    toast.success("Customer added successfully!");
    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdateCustomer = async (id, formData, onSuccess) => {
  try {
    const response = await axiosFormdataInstance.put(
      `/api/customers/update/${id}`,
      formData
    );
    toast.success("Customer updated successfully!");
    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customers");
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

export const handleGetAllCustomers = async () => {
  try {
    const response = await axiosInstance.get("/api/customers/all");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetCustomerData = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/customers/one?id=${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteCustomer = async (id, onSuccess) => {
  try {
    await axiosInstance.delete(`/api/customers/delete/${id}`);
    toast.success("Customer deleted successfully!");
    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
