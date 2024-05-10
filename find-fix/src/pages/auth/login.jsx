import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEO from "@/components/Seo";
import Image from "next/image";
import { loginUser } from "../api/login";
import toast, { Toaster } from "react-hot-toast";
import { getToken } from "@/hooks/useToken";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    console.log(token);
    if (token) {
      router.push("/auth/profile");
      return;
    }
  }, []);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      toast.success("Login successfully!");
      router.push("/auth/profile");
    } catch (error) {
      toast.error(
        error.message || "Failed to login. Please check your credentials."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <SEO title="Login" />
      <div className="max-w-md w-full p-4">
        <div className="text-center mb-4 ml-28">
          <Image src="/images/logo.png" alt="Logo" width={200} height={200} />
        </div>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
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
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLogin}
            >
              Sign In
            </button>
            <p className="inline-block align-baseline font-bold text-sm text-black">
              Don't have an account?{" "}
              <a
                href="/auth/register"
                className="text-red-500 hover:text-red-600"
              >
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
