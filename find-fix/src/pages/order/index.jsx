import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getToken } from "@/hooks/useToken";
import toast, { Toaster } from "react-hot-toast";
import {
  BsStarFill,
  BsGeoAltFill,
  BsCreditCardFill,
  BsClockFill,
  BsCalendarFill,
} from "react-icons/bs";
import {
  RiCellphoneFill,
  RiErrorWarningLine,
  RiMoneyDollarCircleFill,
} from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import {
  MdLocalShipping,
  MdRateReview,
  MdOutlineMiscellaneousServices,
} from "react-icons/md";
import { PiGearBold } from "react-icons/pi";
import { BiMoneyWithdraw } from "react-icons/bi";
import LayoutAdmin from "@/components/LayoutAdmin/Index";
import {
  addReview,
  getOrderAll,
  putStatus,
  uploadPaymentReceipt,
} from "../api/order";
import SEO from "@/components/Seo";
import { getProfile } from "../api/profile";
import CreateSparePartModal from "@/components/Modals/CreateSparepartModal";

export default function OrdersAll() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedStars, setClickedStars] = useState(new Array(5).fill(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [tempRating, setTempRating] = useState(null);
  const [tempReview, setTempReview] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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
  }, []);

  const handleAddReview = async (orderId) => {
    if (tempRating !== null && tempReview.trim() !== "") {
      try {
        await addReview(orderId, tempRating, tempReview);
        toast.success("Review added successfully!");
        const updatedOrders = await getOrderAll();
        setOrders(updatedOrders);
        setTempRating(null);
        setTempReview("");
        window.location.reload();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        }
      }
    } else {
      toast.error("Please provide both rating and review");
    }
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
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleAcceptedStatus = async (orderId) => {
    try {
      await putStatus(orderId, "Process");
      toast.success("Order Process successfully!");
      const updatedOrders = await getOrderAll();
      setOrders(updatedOrders);
      window.location.reload();
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

  const handleInProgressStatus = async (orderId) => {
    try {
      await putStatus(orderId, "Waiting Payment");
      toast.success("Order Waiting Payment successfully!");
      const updatedOrders = await getOrderAll();
      setOrders(updatedOrders);
      window.location.reload();
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

  const handleWaitingPaymentStatus = async (orderId) => {
    try {
      await putStatus(orderId, "Done");
      toast.success("Order Done successfully!");
      const updatedOrders = await getOrderAll();
      setOrders(updatedOrders);
      window.location.reload();
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
  const handleCancelStatus = async (orderId) => {
    try {
      await putStatus(orderId, "Cancel");
      toast.success("Order Cancel successfully!");
      const updatedOrders = await getOrderAll();
      setOrders(updatedOrders);
      window.location.reload();
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPaymentReceipt(file);
  };

  const handleUploadPaymentReceipt = async (orderId) => {
    if (paymentReceipt !== null) {
      try {
        await uploadPaymentReceipt(orderId, paymentReceipt);
        toast.success("Payment receipt uploaded successfully!");
        window.location.reload();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        }
      }
    } else {
      toast.error("Please select a file to upload");
    }
  };

  const filterOrders = () => {
    let filteredOrders = [...orders];

    if (filterRating !== null && filterRating !== "") {
      filteredOrders = filteredOrders.filter(
        (order) => order.rating === parseInt(filterRating)
      );
    }

    if (filterStatus !== null && filterStatus !== "") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === filterStatus
      );
    }

    return filteredOrders;
  };

  const handleRatingFilterChange = (rating) => {
    setFilterRating(rating);
    setClickedStars(new Array(5).fill(false));
  };

  const handleStatusFilterChange = (status) => {
    setFilterStatus(status);
  };

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setIsModalOpen(false);
  };

  const ITEMS_PER_PAGE = 5;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filterOrders().slice(startIndex, endIndex);
  const totalPages = Math.ceil(filterOrders().length / ITEMS_PER_PAGE);

  const formatDate = (dateTimeString) => {
    const dateObj = new Date(dateTimeString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

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
            <div className="flex gap-3 mb-4">
              <div>
                <label className="mr-4 font-semibold">Filter by Rating:</label>
                <select
                  className="border rounded-md p-2"
                  value={filterRating}
                  onChange={(e) => handleRatingFilterChange(e.target.value)}
                >
                  <option value="">All</option>
                  {[...Array(5)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1} star{index === 0 ? "" : "s"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mr-4 font-semibold">Filter by Status:</label>
                <select
                  className="border rounded-md p-2"
                  value={filterStatus}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Process">Process</option>
                  <option value="Waiting Payment">Waiting Payment</option>
                  <option value="Done">Done</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>
            </div>
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
                          className={`font-bold px-2 rounded-md text-white ${
                            order.status === "Done"
                              ? "bg-green-600"
                              : order.status === "Process"
                              ? "bg-yellow-200"
                              : order.status === "Waiting"
                              ? "bg-black "
                              : order.status === "Accepted"
                              ? "bg-blue-600"
                              : order.status === "Waiting Payment"
                              ? "bg-purple-600"
                              : order.status === "Cancel"
                              ? "bg-red-600"
                              : ""
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div>
                        {profileData &&
                          profileData?.role === "admin" &&
                          (order.status === "Accepted" ||
                            order.status === "Process" ||
                            order.status === "Waiting Payment") && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() => openModal(order.id)}
                            >
                              Add Spare Part
                            </button>
                          )}
                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status === "Waiting" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleWaitingtatus(order.id)}
                            >
                              Change Status
                            </button>
                          )}
                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status === "Accepted" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleAcceptedStatus(order.id)}
                            >
                              Change Status
                            </button>
                          )}
                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status === "Process" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleInProgressStatus(order.id)}
                            >
                              Change Status
                            </button>
                          )}

                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status === "Waiting Payment" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                              onClick={() =>
                                handleWaitingPaymentStatus(order.id)
                              }
                            >
                              Change Status
                            </button>
                          )}

                        {profileData &&
                          profileData?.role === "admin" &&
                          order.status !== "Done" &&
                          order.status !== "Cancel" && (
                            <button
                              className="py-2 px-4 ml-4 rounded-md hover:font-semibold bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleCancelStatus(order.id)}
                            >
                              Cancel
                            </button>
                          )}

                        {profileData &&
                          profileData?.role === "Customer" &&
                          order.status === "Waiting Payment" &&
                          !order.paymentReceiptUrl && (
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mb-4"
                              />
                              <button
                                className="py-2 px-4 rounded-md hover:font-semibold bg-red-500 hover:bg-red-600 text-white"
                                onClick={() =>
                                  handleUploadPaymentReceipt(order.id)
                                }
                              >
                                Upload
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
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
                    <div className="flex gap-3 mb-2 text-lg">
                      {order?.spareParts &&
                        order?.spareParts?.length > 0 &&
                        order?.spareParts?.map((sparepart, index) => (
                          <div
                            key={index}
                            className="flex flex-col md:flex-row gap-3"
                          >
                            <PiGearBold className="mt-1" />
                            <span className="font-bold">
                              {sparepart?.quantity}x
                            </span>
                            <span className="font-bold">{sparepart?.name}</span>
                            <span className="font-bold">
                              ${sparepart?.price}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 mb-2 text-lg">
                      <BsCalendarFill />
                      <span className="font-bold">
                        {" "}
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
                    {(order.status === "Done" ||
                      order.status === "Waiting Payment") &&
                      order.paymentReceiptUrl && (
                        <div className="flex gap-3 mb-2 text-lg">
                          <BiMoneyWithdraw className="mt-1" />
                          <span className="font-bold">
                            <img
                              src={order.paymentReceiptUrl}
                              alt={order.serviceName}
                              width={200}
                              height={200}
                              className="rounded-md mb-4"
                            />
                          </span>
                        </div>
                      )}
                    {order.status === "Done" && (
                      <div className="flex gap-3 mb-2 text-lg">
                        {order.review !== "" && (
                          <MdRateReview className="mt-1" />
                        )}
                        <span className="font-bold">{order.review}</span>
                      </div>
                    )}
                    {order.status === "Done" && (
                      <div className="flex gap-3 mb-2 text-lg">
                        {order.rating !== 0 && <BsStarFill className="mt-1" />}
                        {[...Array(order.rating)].map((_, index) => (
                          <BsStarFill
                            key={index}
                            className="text-yellow-500 mt-1 cursor-pointer"
                          />
                        ))}
                      </div>
                    )}

                    {profileData &&
                      profileData?.role === "Customer" &&
                      order.rating === 0 &&
                      order.review === "" &&
                      order.status === "Done" && (
                        <div className="space-y-4">
                          <p className="font-bold text-black">
                            Please rate and review the order:
                          </p>
                          <div className="flex items-center gap-3 mb-2 text-lg">
                            <MdRateReview className="mt-1" />
                            <span className="font-bold">Rating: </span>
                            {[...Array(5)].map((_, index) => (
                              <BsStarFill
                                key={index}
                                className={`text-yellow-500 cursor-pointer ${
                                  index < tempRating
                                    ? "opacity-100"
                                    : "opacity-50"
                                }`}
                                onClick={() => setTempRating(index + 1)}
                              />
                            ))}
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="review"
                              className="font-bold text-black"
                            >
                              Review:
                            </label>
                            <textarea
                              id="review"
                              value={tempReview}
                              onChange={(e) => setTempReview(e.target.value)}
                              rows={4}
                              className="border rounded-md w-full p-2"
                            />
                          </div>
                          <button
                            className="py-2 px-4 rounded-md hover:font-semibold bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleAddReview(order.id)}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    <div className="flex justify-end gap-5">
                      <button className="py-2 px-4 rounded-md hover:font-semibold bg-orange-500 hover:bg-orange-600 text-white">
                        <a href={`/order/${order.id}`}>Check Detail</a>
                      </button>
                    </div>
                  </div>
                ))}
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
            ) : (
              <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-orange-500 mb-6">
                  <RiErrorWarningLine className="text-6xl" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Data Not Found
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Oops! The page you are looking for could not be found.
                </p>
                <p className="py-2 px-4 rounded-md hover:font-semibold bg-orange-500 hover:bg-orange-600 text-white">
                  Change you filter!
                </p>
              </div>
            )}
          </div>
        )}
        <CreateSparePartModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          orderId={selectedOrderId}
        />
      </section>
    </LayoutAdmin>
  );
}
