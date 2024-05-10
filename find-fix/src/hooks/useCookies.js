import Cookies from "universal-cookie";

export function getCookies() {
  const cookies = new Cookies(null, { path: "/" });
  const getToken = cookies.get("token");
  const getName = cookies.get("nama_lengkap");
  const getEmail = cookies.get("email");
  const getRole = cookies.get("role");

  return { getToken, getName, getEmail, getRole };
}

export function removeCookies() {
  const cookies = new Cookies(null, { path: "/" });
  cookies.remove("token");
  cookies.remove("nama_lengkap");
  cookies.remove("email");
  cookies.remove("role");

  return;
}
