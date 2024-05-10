import api from "./base";
import { getToken } from "@/hooks/useToken";

export const getProfile = async () => {
  const token = getToken();
  if (!token) {
    console.error("Token not found");
    return null;
  }
  try {
    const response = await api.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const editProfile = async (name, email, phone, address) => {
  try {
    const response = await api.post("/user/update", {
      name,
      email,
      phone,
      address,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Update Profile failed");
    }
  } catch (error) {
    throw error;
  }
};
