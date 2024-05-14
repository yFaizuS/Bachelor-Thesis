import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getOrderById } from "../api/order";
import { getToken } from "@/hooks/useToken";
import {
  BsStarFill,
  BsStar,
  BsGeoAltFill,
  BsCreditCardFill,
  BsClockFill,
  BsCalendarFill,
} from "react-icons/bs";
import { RiCellphoneFill, RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdRateReview, MdOutlineMiscellaneousServices } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import LayoutAdmin from "@/components/LayoutAdmin/Index";
import SEO from "@/components/Seo";
import UpdateAppointmentModal from "@/components/Modals/UpdateAppointmentModal";
import { getProfile } from "../api/profile";

export default function OrdersById() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Token not found");
        }

        if (id) {
          const orderData = await getOrderById(id);
          setOrder(orderData);
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

    fetchOrder();

    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
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
    fetchProfileData();
  }, [id]);

  console.log(profileData);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  const isDateOneDayBefore = (dateString) => {
    const today = new Date();
    const orderDate = new Date(dateString);
    const diffInMilliseconds = orderDate - today;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  return (
    <LayoutAdmin>
      <Toaster />
      <SEO title="Order Detail" />
      <section className="container mx-auto p-5 md:pl-32 h-screen">
        <h1 className="text-2xl font-bold mb-4">History Order Detail</h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            <div className="flex flex-col md:flex-row bg-gray-50 px-4 py-5 gap-5 sm:px-6">
              <img
                src={order.serviceImageUrl}
                alt={order.serviceName}
                width={400}
                height={400}
                className="rounded-md mb-4"
              />
              <div className="space-y-5">
                <div className="flex gap-3 mb-2 text-lg">
                  <FaUser className="mt-1" />
                  <span className="font-bold"> {order.name}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <RiCellphoneFill className="mt-1" />
                  <span className="font-bold"> {order.phone}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <BsGeoAltFill className="mt-1" />
                  <span className="font-bold">{order.address}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <RiMoneyDollarCircleFill className="mt-1" />
                  <span className="font-bold">${order.totalPrice}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <MdOutlineMiscellaneousServices className="mt-1" />
                  <span className="font-bold">{order.serviceTitle}</span>
                </div>
                <div className="flex items-center gap-3 mb-2 text-lg">
                  <BsCalendarFill />
                  <span className="font-bold">
                    {formatDate(order.orderDate)}
                  </span>
                  <BsClockFill />
                  <span className="font-bold">{order.orderTime}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <BsGeoAltFill className="mt-1" />
                  <span className="font-bold">{order.AppointmentLoc}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <BsCreditCardFill className="mt-1" />
                  <span className="font-bold">{order.payment}</span>
                </div>
                {order.status === "Done" && (
                  <div className="flex gap-3 mb-2 text-lg">
                    <MdRateReview className="mt-1" />
                    <span className="font-bold">{order.review}</span>
                  </div>
                )}
                {order.status === "Done" && (
                  <div className="flex gap-3 mb-2 text-lg">
                    <BsStarFill className="mt-1" />
                    {[...Array(order.rating)].map((_, index) => (
                      <BsStarFill
                        key={index}
                        className="text-yellow-500 mt-1 cursor-pointer"
                      />
                    ))}
                  </div>
                )}
                {order.status !== "Done" &&
                  profileData?.role === "Customer" &&
                  !isDateOneDayBefore(order.orderDate) && (
                    <div>
                      <button
                        className="bg-orange-500 hover:bg-orange-600 text-white hover:font-bold px-4 py-2 rounded-md"
                        onClick={() => openModal()}
                      >
                        Change Appointment
                      </button>
                    </div>
                  )}

                {order.status !== "Done" &&
                  profileData?.role === "Customer" &&
                  isDateOneDayBefore(order.orderDate) && (
                    <div>
                      <p>
                        Note: Change Appointment is not available at this time.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
        <UpdateAppointmentModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          orderId={order && order.id}
        />
      </section>
    </LayoutAdmin>
  );
}
