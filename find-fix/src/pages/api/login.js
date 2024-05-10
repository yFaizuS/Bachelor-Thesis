import api from "./base";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/user/login", { email, password });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    throw error;
  }
};
