import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getToken } from "@/hooks/useToken";
import toast, { Toaster } from "react-hot-toast";
import {
  BsStarFill,
  BsStar,
  BsGeoAltFill,
  BsCreditCardFill,
  BsCreditCard,
} from "react-icons/bs";
import { RiCellphoneFill } from "react-icons/ri";
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import LayoutAdmin from "@/components/LayoutAdmin/Index";
import { addRating, getOrderAll, putStatus } from "../api/order";
import SEO from "@/components/Seo";
import { getProfile } from "../api/profile";

export default function OrdersAll() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempRating, setTempRating] = useState(null);
  const [clickedStars, setClickedStars] = useState(new Array(5).fill(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(16000);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchOrders = async () => {
      const ordersData = await getOrderAll();
      setOrders(ordersData);
      setLoading(false);
    };

    fetchOrders();

    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        console.log(data);
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const convertToDollar = (priceInRupiah, exchangeRate) => {
    return priceInRupiah / exchangeRate;
  };

  const handleAddRating = async (orderId) => {
    if (tempRating !== null) {
      try {
        await addRating(orderId, tempRating);
        toast.success("Rating added successfully!");
        const updatedOrders = await getOrderAll();
        setOrders(updatedOrders);
        setTempRating(null);
        setClickedStars(new Array(5).fill(false));
        window.location.reload();
      } catch (error) {
        console.error("Error adding rating: ", error);
        toast.error("Failed to add rating");
      }
    }
  };

  const handleStarClick = (index) => {
    const newClickedStars = [...clickedStars];
    for (let i = 0; i < newClickedStars.length; i++) {
      newClickedStars[i] = i <= index;
    }
    setClickedStars(newClickedStars);
    setTempRating(index + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleWaitingtatus = async (orderId) => {
    try {
      await putStatus(orderId, "Accepted");
      toast.success("Order Accepted successfully!");
      const updatedOrders = await getOrderAll();
      setOrders(updatedOrders);
      window.location.reload();
    } catch (error) {
      console.error("Error accepting order: ", error);
      toast.error("Failed to accept order");
    }
  };

  const handleAcceptedStatus = async (orderId) => {
    try {
      await putStatus(orderId, "In Progress");
      toast.success("Order In Progress successfully!");
      const updatedOrders = await getOrderAll();
      setOrders(updatedOrders);
      window.location.reload();
    } catch (error) {
      console.error("Error accepting order: ", error);
      toast.error("Failed to accept order");
    }
  };

  const handleInProgressStatus = async (orderId) => {
    try {
      await putStatus(orderId, "Done");
      toast.success("Order Done successfully!");
      const updatedOrders = await getOrderAll();
      setOrders(updatedOrders);
      window.location.reload();
    } catch (error) {
      console.error("Error accepting order: ", error);
      toast.error("Failed to accept order");
    }
  };

  const ITEMS_PER_PAGE = 5;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, endIndex);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  return (
    <LayoutAdmin>
      <Toaster />
      <SEO title="Orders" />
      <section className="container mx-auto p-5 md:pl-32">
        <h1 className="text-3xl font-bold mb-8">History Orders</h1>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div>
            {currentOrders.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded p-6 shadow-md text-gray-600"
                  >
                    <img
                      src={order.serviceImageUrl}
                      alt={order.serviceName}
                      width={200}
                      height={200}
                      className="rounded-md mb-4"
                    />
                    <p className="text-xl font-semibold">{order.serviceName}</p>
                    <div className="flex justify-between">
                      <div className="flex gap-3 mb-2 text-lg">
                        <MdLocalShipping className="mt-1" />
                        <span
                          className={`font-bold px-2 rounded-md ${
                            order.status === "Done"
                              ? "bg-green-200"
                              : order.status === "In Progress"
                              ? "bg-yellow-200"
                              : order.status === "Waiting"
                              ? "bg-white"
                              : order.status === "Accepted"
                              ? "bg-blue-200"
                              : ""
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div>
                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status === "Waiting" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleWaitingtatus(order.id)}
                            >
                              Accept
                            </button>
                          )}
                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status === "Accepted" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleAcceptedStatus(order.id)}
                            >
                              Accept
                            </button>
                          )}
                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status === "In Progress" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleInProgressStatus(order.id)}
                            >
                              Accept
                            </button>
                          )}
                      </div>
                    </div>
                    <div className="flex gap-3 mb-2 text-lg">
                      <RiCellphoneFill className="mt-1" />
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
                      <AiOutlineShoppingCart className="mt-1" />
                      <span className="font-bold"> {order.quantity}</span>
                    </div>
                    <div className="flex gap-3 mb-2 text-lg">
                      <BsCreditCardFill className="mt-1" />
                      <span className="font-bold">
                        ${convertToDollar(order.price, exchangeRate).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex gap-3 mb-2 text-lg">
                      <BsCreditCard className="mt-1" />
                      <span className="font-bold">
                        ${convertToDollar(order.total, exchangeRate).toFixed(0)}
                      </span>
                    </div>
                    {order.rating === null &&
                    order.status === "Done" &&
                    profileData &&
                    profileData?.role === "customer" ? (
                      <div className="space-y-4">
                        <p className="font-bold text-black">
                          Please rate the orders you have placed!
                        </p>
                        <div className="flex">
                          {clickedStars.map((clicked, index) => (
                            <BsStar
                              key={index}
                              className={`text-${
                                clicked ? "yellow" : "gray"
                              }-500 cursor-pointer`}
                              onClick={() => handleStarClick(index)}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {order.rating !== null && (
                          <div className="flex gap-3 mb-2 text-lg">
                            <BsStar className="mt-1" />
                            {[...Array(order.rating)].map((_, index) => (
                              <BsStarFill
                                key={index}
                                className="text-yellow-500 mt-1"
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-end gap-5">
                      {order.rating === null &&
                        order.status === "Done" &&
                        profileData &&
                        profileData?.role === "customer" && (
                          <button
                            className="ml-2 py-2 px-4 rounded-md hover:font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => handleAddRating(order.id)}
                          >
                            Add Rating
                          </button>
                        )}

                      <button className="py-2 px-4 rounded-md hover:font-semibold bg-orange-500 hover:bg-orange-600 text-white">
                        <a href={`/order/${order.id}`}>Check Detail</a>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg">No orders available.</p>
            )}
            <div className="flex justify-center my-8">
              <nav className="inline-block">
                <ul className="pagination flex gap-2 bg-gray-200 p-2 rounded-lg">
                  <li className="page-item">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`page-link ${
                        currentPage === 1
                          ? "bg-gray-500 opacity-50 cursor-not-allowed px-2 py-1 rounded-md text-white"
                          : "px-2 py-1"
                      }`}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index} className="page-item">
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`page-link ${
                          currentPage === index + 1
                            ? "bg-orange-500 rounded-md px-3 py-1 text-white"
                            : "px-3 py-1"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`page-link ${
                        currentPage === totalPages
                          ? "bg-gray-500 opacity-50 cursor-not-allowed rounded-md px-2 py-1 text-white"
                          : "px-2 py-1"
                      }`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </section>
    </LayoutAdmin>
  );
}
