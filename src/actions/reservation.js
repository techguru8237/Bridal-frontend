import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleReserve = async (formData, onSuccess) => {
  try {
    const newReservation = await axiosInstance.post("/api/reservations/reserve", formData);
    onSuccess(newReservation.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetReservations = async () => {
  try {
    const response = await axiosInstance.get("/api/reservations/list");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetAllReservations = async () => {
  try {
    const response = await axiosInstance.get("/api/reservations/all");
    return response.data.reservations;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetReservationsByCustomer = async (id) => {
  try {
    const response = await axiosInstance.post(
      `/api/reservations/list-by-customer`,
      { id }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleReservationPay = async (id) => {
  try {
    const response = await axiosInstance.post("/api/reservations/pay", { id });
    toast.success("Success!");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdateReservation = async (id, formData, onSuccess) => {
  try {
    const response = await axiosInstance.put(`/api/reservations/update/${id}`, formData);
    toast.success(response.data.message)
    onSuccess(response.data.reservation);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetReservationById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/reservations/one/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetCustomers = async (page, limit) => {
  try {
    const response = await axiosInstance.get(
      `/api/customers/list?page=${page}&limit=${limit}`
    );
    return response.data;
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
    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteReservation = async (id, onSuccess) => {
  try {
    const response = await axiosInstance.delete(
      `/api/reservations/delete/${id}`
    );
    toast.success("Deleted reservation successfully");
    onSuccess()
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
