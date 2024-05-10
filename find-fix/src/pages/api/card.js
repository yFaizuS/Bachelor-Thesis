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
