import axiosInstance from "./api";
import { toast } from "react-toastify";

export const handleSignup = async (email, password, onSuccess) => {
  try {
    await axiosInstance.post("/api/users/signup", {
      email,
      password,
    });

    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleLogin = async (formData, onSuccess) => {
  try {
    const response = await axiosInstance.post("/api/users/login", formData);
    toast.success(response.data.message);
    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleForgotPassword = async (email, onSuccess) => {
  try {
    await axiosInstance.post("/api/users/forgot-password", {
      email,
    });

    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const resetPassword = async (token, password) => {
  try {
    await axiosInstance.post("/api/users/reset-password", {
      token,
      password,
    });
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
