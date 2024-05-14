import { getToken } from "@/hooks/useToken";
import api from "./base";

export const getProviderById = async (id) => {
  try {
    const response = await api.get(`/providers/get/${id}`);
    if (response.data && response.data.provider) {
      return response.data.provider;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const addProvider = async (formData) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.post(`/providers/add`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding provider: ", error);
    return null;
  }
};
