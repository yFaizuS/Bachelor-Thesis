import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { getProfile } from "@/pages/api/profile";

const NavbarAdmin = () => {
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

  return (
    <div
      className={
        "relative w-full flex justify-end items-center bg-gray-100 text-black h-full top-0 right-0 -z-30"
      }
    >
      <div className="px-4 py-4 mr-3 md:mr-5">
        {profileData && (
          <div className="flex items-center">
            <span className="mr-2 font-semibold">{profileData.name}</span>
            <FiUser className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarAdmin;
