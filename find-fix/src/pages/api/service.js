import { getToken } from "@/hooks/useToken";
import api from "./base";

export const getAllServices = async () => {
  try {
    const response = await api.get("/services/getall");
    return response.data.services;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/get/${id}`);
    if (response.data && response.data.service) {
      return response.data.service;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const addService = async (
  title,
  providerId,
  description,
  price,
  openDateTime
) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.post(
      "/services/add",
      {
        title,
        providerId,
        description,
        price,
        openDateTime,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding service: ", error);
    throw error.response
      ? error.response.data.message
      : "Failed to add service";
  }
};

export const uploadImageService = async (serviceId, file) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post(
      `/services/storeiImg/${serviceId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading service image: ", error);
    return null;
  }
};
