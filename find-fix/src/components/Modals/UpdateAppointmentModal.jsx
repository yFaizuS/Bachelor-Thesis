import React, { useState, useEffect } from "react";
import { MdSave } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { putAppointment } from "@/pages/api/order";

const UpdateAppointmentModal = ({
  isOpen,
  closeModal,
  orderId,
  openDates,
  openTimes,
}) => {
  const [formData, setFormData] = useState({
    orderTime: "",
    orderDate:
      openDates && openDates.length > 0 ? new Date(openDates[0]) : new Date(),
  });
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (openDates && openDates.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        orderDate: new Date(openDates[0]),
      }));
    }
    if (openTimes && openTimes.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        orderTime: openTimes[0][0],
      }));
    }
  }, [openDates, openTimes]);

  useEffect(() => {
    if (openDates && openDates.length > 0) {
      const dateIndex = openDates.findIndex(
        (dateStr) =>
          new Date(dateStr).toDateString() === formData.orderDate.toDateString()
      );
      if (dateIndex !== -1) {
        setAvailableTimes(openTimes[dateIndex]);
        setFormData((prevFormData) => ({
          ...prevFormData,
          orderTime: openTimes[dateIndex][0],
        }));
      } else {
        setAvailableTimes([]);
      }
    }
  }, [formData.orderDate, openDates, openTimes]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, orderDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { orderTime, orderDate } = formData;
      await putAppointment(orderId, orderTime, orderDate);
      toast.success("Update appointment order successfully!");
      window.location.reload();
      closeModal();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update appointment order.");
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
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-full">
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
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col sm:flex-row sm:gap-6">
                  <div className="gap-10  md:gap-20">
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
                        tileDisabled={({ date }) => {
                          const formattedDate = {
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                          };
                          const orderDatesFormatted =
                            openDates && openDates.length > 0
                              ? openDates.map((dateStr) => {
                                  const [month, day, year] = dateStr.split("/");
                                  return {
                                    year: parseInt(year),
                                    month: parseInt(month),
                                    day: parseInt(day),
                                  };
                                })
                              : [];

                          return !orderDatesFormatted.some((openDate) => {
                            return (
                              openDate.year === formattedDate.year &&
                              openDate.month === formattedDate.month &&
                              openDate.day === formattedDate.day
                            );
                          });
                        }}
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
                        {availableTimes.map((time, index) => (
                          <div
                            key={index}
                            className={`border border-gray-300 rounded px-3 py-2 text-center cursor-pointer ${
                              formData.orderTime === time
                                ? "bg-blue-500 text-white"
                                : ""
                            }`}
                            onClick={() =>
                              handleChange({
                                target: {
                                  name: "orderTime",
                                  value: time,
                                },
                              })
                            }
                          >
                            {time}
                          </div>
                        ))}
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

export default UpdateAppointmentModal;
