import React, { useState, useEffect } from "react";
import { MdSave } from "react-icons/md";
import { addOrder } from "@/pages/api/order";
import toast, { Toaster } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CreateOrderModal = ({
  isOpen,
  closeModal,
  reloadOrders,
  selectedServiceId,
}) => {
  const [formData, setFormData] = useState({
    serviceId: "",
    name: "",
    phone: "",
    address: "",
    orderTime: "",
    orderDate: new Date(),
    paymentMethod: "",
    appointmentLoc: "",
  });

  useEffect(() => {
    if (selectedServiceId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        serviceId: Array.isArray(selectedServiceId)
          ? selectedServiceId[0]
          : selectedServiceId,
      }));
    }
  }, [selectedServiceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, orderDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        name,
        phone,
        address,
        serviceId,
        orderTime,
        orderDate,
        paymentMethod,
        appointmentLoc,
      } = formData;
      await addOrder(
        name,
        phone,
        address,
        serviceId,
        orderTime,
        orderDate,
        paymentMethod,
        appointmentLoc
      );
      toast.success("Order added successfully!");
      reloadOrders();
      closeModal();
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

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  return (
    <>
      <Toaster />
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } fixed inset-0 overflow-y-auto`}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-2/3 sm:max-w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 3h13.856c1.54 0 2.783-1.214 2.783-2.71L21 7a3 3 0 00-3-3H6a3 3 0 00-3 3v12c0 1.574 1.215 2.793 2.783 2.793z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Add Order
                  </h3>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col sm:flex-row sm:gap-6">
                  <div className="sm:w-1/2">
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Name"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Phone
                      </label>
                      <input
                        type="number"
                        name="phone"
                        pattern="[0-9]*"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Phone"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="address"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Address"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="paymentMethod"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Payment Method
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        required
                        placeholder="Cash"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Payment Method</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="appointmentLoc"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Appointment Location
                      </label>
                      <select
                        name="appointmentLoc"
                        value={formData.appointmentLoc}
                        onChange={handleChange}
                        required
                        placeholder="Home"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Appointment Location</option>
                        <option value="Home">Home</option>
                        <option value="GotoProvider">GotoProvider</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:w-1/2">
                    <div className="mb-4">
                      <label
                        htmlFor="orderDate"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Order Date
                      </label>
                      <Calendar
                        onChange={handleDateChange}
                        value={formData.orderDate}
                        minDate={today}
                        maxDate={maxDate}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="orderTime"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Order Time
                      </label>
                      <div className="grid grid-cols-4 gap-4">
                        {[...Array(24)].map((_, index) => {
                          const hour = index.toString().padStart(2, "0");
                          return (
                            <div
                              key={index}
                              className={`border border-gray-300 rounded px-3 py-2 text-center cursor-pointer ${
                                formData.orderTime === `${hour}:00`
                                  ? "bg-blue-500 text-white"
                                  : ""
                              }`}
                              onClick={() =>
                                handleChange({
                                  target: {
                                    name: "orderTime",
                                    value: `${hour}:00`,
                                  },
                                })
                              }
                            >
                              {`${hour}:00`}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 flex items-center"
                  >
                    <MdSave className="h-5 w-5 mr-2" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="border border-gray-300 px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateOrderModal;
