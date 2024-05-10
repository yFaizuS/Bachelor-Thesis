import api from "./base";

export const registerUser = async (name, email, password, nomor, alamat) => {
  try {
    const response = await api.post("/user/register", {
      name,
      email,
      password,
      nomor,
      alamat,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Register failed");
    }
  } catch (error) {
    throw error;
  }
};
