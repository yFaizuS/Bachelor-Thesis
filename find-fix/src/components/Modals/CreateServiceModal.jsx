import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addService } from "@/pages/api/service";

const CreateServiceModal = ({ isOpen, closeModal, providerId }) => {
  const [formData, setFormData] = useState({
    title: "",
    providerId: providerId,
    description: "",
    price: "",
    openDateTime: {
      openDate: new Date(),
      openTime: [],
    },
  });

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      providerId: providerId,
    }));
  }, [providerId]);

  const [openTime, setOpenTime] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      openDateTime: {
        ...prevFormData.openDateTime,
        openTime: [...prevFormData.openDateTime.openTime, time],
      },
    }));
    setOpenTime(time);
  };

  const handleRemoveTime = (time) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      openDateTime: {
        ...prevFormData.openDateTime,
        openTime: prevFormData.openDateTime.openTime.filter((t) => t !== time),
      },
    }));
    setOpenTime("");
  };

  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      openDateTime: { ...prevFormData.openDateTime, openDate: date },
      openTime: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { title, providerId, description, price, openDateTime } = formData;

      await addService(title, providerId, description, price, {
        openDate: format(openDateTime.openDate, "MM/dd/yyyy"),
        openTime: openDateTime.openTime,
      });

      toast.success("Service added successfully!");
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
                    Add Service
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
                        htmlFor="title"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Title"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Description"
                        rows={3}
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="price"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="Price"
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="providerId"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Provider ID
                      </label>
                      <input
                        type="text"
                        name="providerId"
                        value={providerId}
                        onChange={handleChange}
                        required
                        placeholder="asjaosaIla"
                        disabled
                        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="sm:w-1/2">
                    <div className="mb-4">
                      <label
                        htmlFor="openDateTime"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Open Date & Time
                      </label>
                      <div className="space-y-2">
                        <Calendar
                          onChange={handleDateChange}
                          value={formData.openDateTime.openDate}
                          minDate={today}
                          maxDate={maxDate}
                        />
                        <div className="grid grid-cols-4 gap-4">
                          {[...Array(24)].map((_, index) => {
                            const hour = index.toString().padStart(2, "0");
                            const isSelected =
                              formData.openDateTime.openTime.includes(
                                `${hour}:00`
                              );
                            return (
                              <div
                                key={index}
                                className={`border border-gray-300 rounded px-3 py-2 text-center cursor-pointer ${
                                  isSelected ? "bg-blue-500 text-white" : ""
                                }`}
                                onClick={() => {
                                  if (isSelected) {
                                    handleRemoveTime(`${hour}:00`);
                                  } else {
                                    handleTimeChange(`${hour}:00`);
                                  }
                                }}
                              >
                                {`${hour}:00`}
                              </div>
                            );
                          })}
                        </div>
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

export default CreateServiceModal;
