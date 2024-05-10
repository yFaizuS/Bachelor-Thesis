import { useEffect, useState } from "react";
import SEO from "@/components/Seo";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { registerUser } from "../api/register";
import { getToken } from "@/hooks/useToken";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomor, setNomor] = useState("");
  const [alamat, setAlamat] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    console.log(token);
    if (token) {
      router.push("/auth/profile");
      return;
    }
  }, []);

  const handleRegister = async () => {
    try {
      const data = await registerUser(name, email, password, nomor, alamat);
      toast.success("Register successfully!");
      console.log("Register successfully! Token:", data.token);
    } catch (error) {
      toast.error(
        error.message || "Failed to register. Please check your credentials."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <SEO title="Register" />
      <div className="max-w-md w-full p-4">
        <div className="text-center mb-4 ml-28">
          <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
        </div>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nomor"
            >
              Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="nomor"
              type="number"
              placeholder="Enter your nomor"
              value={nomor}
              onChange={(e) => setNomor(e.target.value)}
              pattern="[0-9]*"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="alamat"
            >
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="alamat"
              type="alamat"
              placeholder="Enter your alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
            <p className="inline-block align-baseline font-bold text-sm text-black">
              Do have an account?{" "}
              <a href="/auth/login" className="text-red-500 hover:text-red-600">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
