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

export const addReview = async (orderId, rating, review) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    await api.post(
      `/reviews/add/${orderId}`,
      { rating, review },
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

export const addOrder = async (
  name,
  phone,
  address,
  serviceId,
  orderTime,
  orderDate,
  paymentMethod,
  appointmentLoc
) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.post(
      "/orders/add",
      {
        serviceId,
        name,
        phone,
        address,
        orderTime,
        orderDate,
        paymentMethod,
        appointmentLoc,
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

export const addSparePart = async (orderId, spareParts) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.post(
      `/orders/updateSpareParts/${orderId}`,
      { spareParts },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding spare part: ", error);
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

export const putAppointment = async (orderId, orderTime, orderDate) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    await api.post(
      `/orders/updateAppointment/${orderId}`,
      { orderTime, orderDate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error update appointment: ", error);
  }
};

export const uploadPaymentReceipt = async (orderId, file) => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post(
      `/orders/uploadPaymentReceipt/${orderId}`,
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
    console.error("Error uploading payment receipt: ", error);
    return null;
  }
};
