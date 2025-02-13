import axios from "axios";
import axiosInstance, { axiosFormdataInstance } from "./api";
import { toast } from "react-toastify";

export const handleCreateProduct = async (formData, onSuccess) => {
  try {
    const response = await axiosFormdataInstance.post(
      "/api/products/create",
      formData
    );

    toast.success("Item added successfully!");

    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleUpdateProduct = async (id, formData, onSuccess) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("Item updated successfully!");

    onSuccess(response.data);
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleAddStockItem = async (id, quantity) => {
  try {
    const response = await axiosInstance.put(`/api/products/add-stock/${id}`, {
      quantity,
    });

    // Assuming the response contains the updated product data
    const updatedProduct = response.data; // Adjust this based on your API response structure
    return updatedProduct; // Return the updated product
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  // Ensure that the function always returns a value
  return null; // This ensures that the function has a return value in all cases
};

export const handleGetProducts = async (page, limit) => {
  try {
    const response = await axiosInstance.get(
      `/api/products/list?page=${page}&limit=${limit}`
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

export const handleGetAllProducts = async () => {
  try {
    const response = await axiosInstance.get("/api/products/all");

    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleGetProductData = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/products/one?id=${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

export const handleDeleteProduct = async (id, onSuccess) => {
  try {
    await axiosInstance.delete(`/api/products/delete/${id}`);
    toast.success("Item removed successfully!");

    onSuccess();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      toast.error(error.response.data.errors[0].detail);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};
