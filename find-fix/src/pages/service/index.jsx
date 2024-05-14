import React, { useEffect, useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { ImProfile } from "react-icons/im";
import toast, { Toaster } from "react-hot-toast";
import { getAllServices, uploadImageService } from "../api/service";
import LayoutAdmin from "@/components/LayoutAdmin/Index";
import CreateServiceModal from "@/components/Modals/CreateServiceModal";
import SEO from "@/components/Seo";

export default function Service() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "serviceTitle",
    direction: "ascending",
  });
  const [providerId, setProviderId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(10);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
        setLoading(false);
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
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleUploadImage = async (serviceId) => {
    if (file !== null) {
      try {
        await uploadImageService(serviceId, file);
        toast.success("Image uploaded successfully!");
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

  const openModal = (providerId) => {
    setIsModalOpen(true);
    setProviderId(providerId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sortBy = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedServices = [...services].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = sortedServices.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(sortedServices.length / servicesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <LayoutAdmin>
      <Toaster />
      <SEO title="Services" />
      <section className="container mx-auto p-5 md:pl-32">
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 px-4 py-2">Image</th>
                    <th
                      className="border border-gray-400 px-4 py-2"
                      onClick={() => sortBy("serviceTitle")}
                    >
                      Service Title
                      <span className="cursor-pointer">
                        {sortConfig.key === "serviceTitle" &&
                          (sortConfig.direction === "ascending" ? (
                            <FiChevronUp className="ml-1 inline" />
                          ) : (
                            <FiChevronDown className="ml-1 inline" />
                          ))}
                      </span>
                    </th>
                    <th
                      className="border border-gray-400 px-4 py-2"
                      onClick={() => sortBy("price")}
                    >
                      Price
                      <span className="cursor-pointer">
                        {sortConfig.key === "price" &&
                          (sortConfig.direction === "ascending" ? (
                            <FiChevronUp className="ml-1 inline" />
                          ) : (
                            <FiChevronDown className="ml-1 inline" />
                          ))}
                      </span>
                    </th>
                    <th
                      className="border border-gray-400 px-4 py-2"
                      onClick={() => sortBy("openDate")}
                    >
                      Open Date
                      <span className="cursor-pointer">
                        {sortConfig.key === "openDate" &&
                          (sortConfig.direction === "ascending" ? (
                            <FiChevronUp className="ml-1 inline" />
                          ) : (
                            <FiChevronDown className="ml-1 inline" />
                          ))}
                      </span>
                    </th>
                    <th
                      className="border border-gray-400 px-4 py-2"
                      onClick={() => sortBy("openDateTime")}
                    >
                      Open Time
                      <span className="cursor-pointer">
                        {sortConfig.key === "openDateTime" &&
                          (sortConfig.direction === "ascending" ? (
                            <FiChevronUp className="ml-1 inline" />
                          ) : (
                            <FiChevronDown className="ml-1 inline" />
                          ))}
                      </span>
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Action</th>{" "}
                  </tr>
                </thead>
                <tbody>
                  {currentServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-100">
                      <td className="border border-gray-400 px-4 py-2">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt="Service Image"
                            width={200}
                            height={200}
                          />
                        ) : (
                          <div>
                            <div className="flex justify-center items-center w-full h-40 bg-gray-200 rounded-md mb-4">
                              <ImProfile className="text-4xl text-gray-500" />
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="mb-4"
                            />
                            <button
                              onClick={() => handleUploadImage(service.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded mt-2"
                            >
                              Upload Image
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {service.title}
                      </td>

                      <td className="border border-gray-400 px-4 py-2 text-end">
                        ${service.price}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {Array.isArray(service.openDateTime)
                          ? service.openDateTime.map((dateTime, index) => (
                              <p key={index}>
                                {Array.isArray(dateTime.openDate)
                                  ? dateTime.openDate.join(", ")
                                  : dateTime.openDate}
                              </p>
                            ))
                          : Array.isArray(service.openDateTime.openDate)
                          ? service.openDateTime.openDate.join(", ")
                          : service.openDateTime.openDate}
                      </td>

                      <td className="border border-gray-400 px-4 py-2">
                        {Array.isArray(service.openDateTime)
                          ? service.openDateTime.map((dateTime, index) => (
                              <p key={index}>
                                {Array.isArray(dateTime.openTime)
                                  ? dateTime.openTime.join(", ")
                                  : dateTime.openTime}
                              </p>
                            ))
                          : Array.isArray(service.openDateTime.openTime)
                          ? service.openDateTime.openTime.join(", ")
                          : service.openDateTime.openTime}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        <button
                          onClick={() => openModal(service.providerId)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded"
                        >
                          + Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>
            <ul className="flex space-x-2">
              {Array.from(
                { length: Math.ceil(sortedServices.length / servicesPerPage) },
                (_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      } hover:bg-gray-300`}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
            <button
              onClick={nextPage}
              disabled={
                currentPage ===
                Math.ceil(sortedServices.length / servicesPerPage)
              }
              className={`px-3 py-1 rounded-md ${
                currentPage ===
                Math.ceil(sortedServices.length / servicesPerPage)
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
        <CreateServiceModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          providerId={providerId}
        />
      </section>
    </LayoutAdmin>
  );
}
