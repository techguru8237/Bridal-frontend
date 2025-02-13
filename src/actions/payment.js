import axiosInstance, { axiosFormdataInstance } from "./api";
import { toast } from "react-toastify";

export const handleCreatePayment = async (paymentData, onSuccess) => {
  try {
    const response = await axiosFormdataInstance.post(
      "/api/payments/create",
      paymentData
    );
    if (response.status === 201) {
      toast.success("Payment created successfully!");
      onSuccess(response.data.payment);
    }
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetPayments = async () => {
  try {
    const response = await axiosInstance.get("/api/payments/all");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetPaymentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/payments/get-by-id/${id}`);
    if (response.status === 200) {
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

export const handleUpdatePayment = async (id, paymentData, onSuccess) => {
  try {
    const response = await axiosFormdataInstance.put(
      `/api/payments/update/${id}`,
      paymentData
    );
    if (response.status === 200) {
      toast.success("Payment updated successfully!");
      onSuccess(response.data.payment);
    }
  } catch (error) {
    console.log("error :>> ", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};

export const handleDeletePayment = async (id, onSuccess) => {
  try {
    await axiosInstance.delete(`/api/payments/${id}`);
    toast.success("Payment deleted successfully!");
    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
