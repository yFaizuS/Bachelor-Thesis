import React, { useEffect, useState } from "react";
import LayoutAdmin from "@/components/LayoutAdmin/Index";
import SEO from "@/components/Seo";
import { getCheckout, checkoutAdd, checkoutRemove } from "../api/checkout";
import { FaShoppingCart, FaMoneyBillAlt, FaShoppingBag } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { getToken } from "@/hooks/useToken";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import CreateOrderModal from "@/components/Modals/CreateOrderModal";
import RemoveQuantityModal from "@/components/Modals/RemoveQuantityModal";

const ITEMS_PER_PAGE = 5;

export default function Checkout() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [itemToRemove, setItemToRemove] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(16000);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchCheckoutData = async () => {
      const data = await getCheckout();
      setCheckoutData(data);
    };
    fetchCheckoutData();
  }, []);

  const handleAddQuantity = async (serviceId) => {
    await checkoutAdd(serviceId);
    const updatedData = await getCheckout();
    setCheckoutData(updatedData);
  };

  const convertToDollar = (priceInRupiah, exchangeRate) => {
    return priceInRupiah / exchangeRate;
  };

  const handleRemoveQuantity = async (serviceId, quantity) => {
    if (quantity === 1) {
      setItemToRemove(serviceId);
      setIsModalOpen(true);
    } else {
      await checkoutRemove(serviceId);
      const updatedData = await getCheckout();
      setCheckoutData(updatedData);
    }
  };

  const confirmRemoveItem = async () => {
    await checkoutRemove(itemToRemove);
    const updatedData = await getCheckout();
    setCheckoutData(updatedData);
    setIsModalOpen(false);
    setItemToRemove(null);
    toast.success("Remove successfully!");
  };

  const openModal = (serviceId) => {
    setIsModalOpen(true);
    setSelectedServiceId(serviceId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
  };

  const displayData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return checkoutData.data.services.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    (checkoutData?.data.services.length || 0) / ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <LayoutAdmin>
      <Toaster />
      <SEO title="Checkouts" />
      <section className="container mx-auto p-5 md:pl-32">
        <h1 className="text-3xl font-bold mb-4">History Carts</h1>
        {checkoutData ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                History Checkouts
              </h3>
            </div>
            <div className="border-t  border-gray-200">
              <div>
                {displayData().map((service) => (
                  <div
                    key={service.serviceid}
                    className="flex flex-col md:flex-row border-b bg-gray-50 px-4 py-5 gap-5 sm:px-6"
                  >
                    <div>
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        width={400}
                        height={400}
                        className="rounded-md mb-4"
                      />
                    </div>
                    <div className="space-y-5">
                      <div className="text-2xl font-bold text-gray-900">
                        <MdLocalOffer className="inline-block mr-2" />{" "}
                        {service.title}
                      </div>
                      <div className="mt-1 text-xl font-medium text-gray-900 sm:col-span-2">
                        <FaMoneyBillAlt className="inline-block mr-2" /> $
                        {convertToDollar(service.price, exchangeRate).toFixed(
                          0
                        )}
                      </div>
                      <div className="flex gap-2 mt-1 text-xl font-medium text-gray-900 sm:col-span-2">
                        <FaShoppingCart className="inline-block mr-2 mt-2" />
                        <div className="flex items-center">
                          <button
                            className="text-orange-500 focus:outline-none bg-gray-200 px-2 py-1 rounded-l"
                            onClick={() =>
                              handleRemoveQuantity(
                                service.serviceid,
                                service.quantity
                              )
                            }
                          >
                            -
                          </button>
                          <span className="px-2 py-1 bg-gray-200">
                            {service.quantity}
                          </span>
                          <button
                            className="text-orange-500 focus:outline-none bg-gray-200 px-2 py-1 rounded-r"
                            onClick={() => handleAddQuantity(service.serviceid)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 text-xl font-medium text-gray-900 sm:col-span-2">
                        <FaMoneyBillAlt className="inline-block mr-2" /> $
                        {convertToDollar(
                          service.totalPrice,
                          exchangeRate
                        ).toFixed(0)}
                      </div>
                      <button
                        onClick={() => openModal(service.serviceid)}
                        className="bg-orange-500 text-white px-4 py-2 rounded mr-2 hover:bg-orange-600 flex items-center"
                      >
                        <FaShoppingBag className="mr-2" /> Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}
        <div className="flex justify-center my-8">
          <nav className="inline-block">
            <ul className="pagination flex gap-2 bg-gray-200 p-2 rounded-lg">
              <li className="page-item">
                <button
                  className={`mx-1 px-4 py-2 border ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed rounded-md bg-gray-500"
                      : ""
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`mx-1 px-4 py-2 border ${
                    currentPage === i + 1
                      ? "bg-orange-500 rounded-md text-white"
                      : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <li className="page-item">
                <button
                  className={`mx-1 px-4 py-2 border ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed rounded-md bg-gray-500"
                      : ""
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <CreateOrderModal
          isOpen={isModalOpen && !itemToRemove}
          closeModal={closeModal}
          reloadOrders={() => {}}
          selectedServiceId={selectedServiceId}
        />
        {itemToRemove && (
          <RemoveQuantityModal
            confirmRemoveItem={confirmRemoveItem}
            closeModal={closeModal}
          />
        )}
      </section>
    </LayoutAdmin>
  );
}
