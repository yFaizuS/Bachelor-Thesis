import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { getProfile, editProfile } from "../api/profile";
import { getToken } from "@/hooks/useToken";
import LayoutAdmin from "@/components/LayoutAdmin/Index";
import SEO from "@/components/Seo";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiUserCheck,
  FiMapPin,
  FiEdit,
} from "react-icons/fi";
import EditProfileModal from "@/components/Modals/UpdateProfileModal";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      const profileData = await getProfile();
      console.log(profileData);
      setProfile(profileData);
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const reloadProfile = async () => {
    const profileData = await getProfile();
    setProfile(profileData);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <LayoutAdmin>
      <SEO title="Profile" />
      <section className="container mx-auto p-5 md:pl-32 h-screen">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div>
            {profile ? (
              <div className="grid md:grid-cols-2 gap-5">
                <div className="mb-4 flex w-full items-center border rounded-md p-3 bg-gray-100">
                  <FiUser className="mr-2 text-5xl" />
                  <div>
                    <p className="font-normal text-xl">Name</p>
                    <p className="font-semibold text-xl">{profile.name}</p>
                  </div>
                </div>
                <div className="mb-4 flex w-full items-center border rounded-md p-3 bg-gray-100">
                  <FiMail className="mr-2 text-5xl" />
                  <div>
                    <p className="font-normal text-xl">Email</p>
                    <p className="font-semibold text-xl">{profile.email}</p>
                  </div>
                </div>
                <div className="mb-4 flex w-full items-center border rounded-md p-3 bg-gray-100">
                  <FiPhone className="mr-2 text-5xl" />
                  <div>
                    <p className="font-normal text-xl">Phone</p>
                    <p className="font-semibold text-xl">{profile.phone}</p>
                  </div>
                </div>
                <div className="mb-4 flex w-full items-center border rounded-md p-3 bg-gray-100">
                  <FiMapPin className="mr-2 text-5xl" />
                  <div>
                    <p className="font-normal text-xl">Address</p>
                    <p className="font-semibold text-xl">{profile.address}</p>
                  </div>
                </div>
                <div className="mb-4 flex w-full items-center border rounded-md p-3 bg-gray-100">
                  <FiUserCheck className="mr-2 text-5xl" />
                  <div>
                    <p className="font-normal text-xl">Role</p>
                    <p className="font-semibold text-xl">{profile.role}</p>
                  </div>
                </div>
                <div className="mb-4 flex w-full items-center border rounded-md p-3 bg-gray-100">
                  <FiEdit
                    className="mr-2 text-5xl cursor-pointer text-orange-500 hover:text-orange-600"
                    onClick={openEditModal}
                  />
                  <div>
                    <p className="font-normal text-xl">Edit Profile</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Failed to load profile.</p>
            )}
          </div>
        )}
        <EditProfileModal
          isOpen={isEditModalOpen}
          closeModal={closeEditModal}
          profile={profile}
          reloadProfile={reloadProfile}
        />
      </section>
    </LayoutAdmin>
  );
}
