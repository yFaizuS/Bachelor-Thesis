import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Index";
import { FiShoppingCart } from "react-icons/fi";
import SEO from "@/components/Seo";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaDollarSign,
  FaStar,
  FaComment,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { getServiceById } from "./api/service";
import CreateOrderModal from "@/components/Modals/CreateOrderModal";
import { getToken } from "@/hooks/useToken";

export default function ServiceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const serviceData = await getServiceById(id);
          setService(serviceData);
          setLoading(false);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        }
      }
    };

    fetchData();

    return () => {};
  }, [id]);

  const openModal = () => {
    const token = getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <Toaster />
      <SEO title={service ? service.title : "Loading..."} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <section className="md:h-screen py-5 px-5 lg:px-10 md:px-96">
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-700 mb-4">{service.description}</p>
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-2">Open Date and Time</h3>
              {service.openDateTime.map((dateTime, index) => (
                <div key={index} className="flex items-center space-y-1">
                  <FaCalendarAlt className="text-orange-500 mr-2" />
                  <p className="text-base font-semibold mr-4">
                    {dateTime.openDate}
                  </p>
                  <FaClock className="text-orange-500 mr-2" />
                  <p className="text-base font-semibold">
                    {dateTime.openTime.join(", ")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-center mb-2 underline">
              <FaUser className="text-orange-500 mr-2" />
              <a
                href={`/provider/${service.providerId}`}
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                {service.providerTitle}
              </a>
            </div>
            <div className="flex items-center mb-2">
              <FaDollarSign className="text-orange-500 mr-2" />
              <p className="text-orange-500 font-semibold">${service.price}</p>
            </div>
            <div className="flex items-center mb-2">
              <FaStar className="text-orange-500 mr-2" />
              <p className="text-orange-500 font-semibold">
                {service.averageRating}
              </p>
            </div>
            <div className="flex items-center mb-2">
              <FaComment className="text-orange-500 mr-2" />
              <p className="text-orange-500 font-semibold">
                {service.totalReviews}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="flex gap-2 py-2 px-2 rounded-md hover:font-bold bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => openModal()}
              >
                <FiShoppingCart size={24} />
                Order
              </button>
            </div>
          </div>
          <CreateOrderModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            reloadOrders={() => {}}
            selectedServiceId={id}
          />
        </section>
      )}
    </Layout>
  );
}
