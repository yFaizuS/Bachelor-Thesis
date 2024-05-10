import api from "./base";
import { getToken } from "@/hooks/useToken";

export const getCheckout = async () => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.get("/checkout/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const checkoutAdd = async (serviceId) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    await api.post(`/checkout/add/${serviceId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error adding quantity: ", error);
  }
};

export const checkoutRemove = async (serviceId) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    await api.post(`/checkout/remove/${serviceId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error removing quantity: ", error);
  }
};
