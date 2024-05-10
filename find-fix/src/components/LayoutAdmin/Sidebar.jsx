import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import {
  FiMenu,
  FiX,
  FiUser,
  FiPackage,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";
import { removeToken } from "@/hooks/useToken";
import { getProfile } from "@/pages/api/profile";

const Sidebar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const isActive = (pathname) => router.pathname === pathname;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    try {
      removeToken();
      toast.success("Logout successfully");
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <>
      <Toaster />
      <div
        className={
          "relative lg:w-64 lg:flex lg:flex-col lg:overflow-y-auto lg:fixed lg:top-0 lg:left-0 lg:h-full bg-gray-100 text-black flex-shrink-0"
        }
      >
        <div className="lg:hidden absolute top-0 right-0 p-4">
          {isOpen ? (
            <button onClick={closeSidebar}>
              <FiX className="h-6 w-6" />
            </button>
          ) : (
            <button onClick={toggleSidebar}>
              <FiMenu className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className="flex justify-center py-5">
          <a href="/">
            <Image src="/images/logo.png" alt="Logo" width={150} height={150} />
          </a>
        </div>
        <nav className={`px-2 py-4 ${isOpen ? "" : "hidden"}`}>
          <ul>
            <li className="mb-2">
              <a
                href="/auth/profile"
                className={`flex items-center justify-between px-4 py-2 rounded ${
                  isActive("/auth/profile")
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-300"
                }`}
              >
                <span>Profile</span>
                <FiUser className="h-5 w-5" />
              </a>
            </li>
            <li className="mb-2">
              <a
                href="/order"
                className={`flex items-center justify-between px-4 py-2 rounded ${
                  isActive("/order")
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-300"
                }`}
              >
                <span>Orders</span>
                <FiPackage className="h-5 w-5" />
              </a>
            </li>
            {profileData?.role === "customer" && (
              <li className="mb-2">
                <a
                  href="/checkout"
                  className={`flex items-center justify-between px-4 py-2 rounded ${
                    isActive("/checkout")
                      ? "bg-gray-700 text-white"
                      : "hover:bg-gray-300"
                  }`}
                >
                  <span>Checkouts</span>
                  <FiShoppingCart className="h-5 w-5" />
                </a>
              </li>
            )}
            <li className="mb-2 cursor-pointer">
              <span
                onClick={handleLogout}
                className="flex items-center justify-between px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                <span>Logout</span>
                <FiLogOut className="h-5 w-5" />
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
