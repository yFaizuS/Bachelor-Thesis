import { useEffect, useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import Image from "next/image";
import { getProfile } from "@/pages/api/profile";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="text-orange-500">
      <div className="flex justify-between items-center px-5 md:px-10 py-4">
        <div>
          <a href="/">
            <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
          </a>
        </div>

        <div className="md:hidden">
          {!isMenuOpen ? (
            <button onClick={toggleMenu}>
              <FiMenu size={24} />
            </button>
          ) : (
            <button onClick={closeMenu}>
              <FiX size={24} />
            </button>
          )}
        </div>
        <div
          className={`md:flex ${isMenuOpen ? "block" : "hidden"} mt-4 md:mt-0`}
        >
          {/* <a
            href="/card"
            className="block mt-4 md:inline-block md:mt-2 mr-6 hover:underline hover:text-orange-600"
            onClick={closeMenu}
          >
            Card
          </a> */}

          {profileData ? (
            <div className="px-4 py-4">
              <a href="/auth/profile">
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">{profileData.name}</span>
                  <FiUser className="h-5 w-5" />
                </div>
              </a>
            </div>
          ) : (
            <div className="pt-2 md:pt-0">
              <button className="bg-orange-500 hover:bg-orange-600 text-white hover:font-bold px-4 py-2 rounded-md">
                <a href="/auth/login">Login</a>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
