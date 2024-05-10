import api from "./base";
import { getToken } from "@/hooks/useToken";

export const getOrderAll = async () => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.get("/orders/getall", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const getOrderById = async (id) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.get(`orders/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.order;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const addRating = async (orderId, rating) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    await api.post(
      `/orders/rate/${orderId}`,
      { rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error adding rating: ", error);
  }
};

export const addOrder = async (name, phone, address, serviceid) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.post(
      "/orders/add",
      {
        orders: [{ serviceid }],
        name,
        phone,
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding order: ", error);
    return null;
  }
};

export const putStatus = async (orderId, status) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    await api.post(
      `/orders/status/${orderId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error adding status: ", error);
  }
};
