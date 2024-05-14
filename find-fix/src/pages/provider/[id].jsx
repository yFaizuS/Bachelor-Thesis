import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProviderById } from "../api/provider";
import Layout from "@/components/Layout/Index";
import { Toaster } from "react-hot-toast";
import SEO from "@/components/Seo";
import { RiErrorWarningLine } from "react-icons/ri";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function ProviderById() {
  const router = useRouter();
  const { id } = router.query;
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(25);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const providerData = await getProviderById(id);
          setProvider(providerData);
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

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedServices = provider
    ? [...provider.services].sort((a, b) => {
        if (sortBy) {
          const valueA = a[sortBy];
          const valueB = b[sortBy];
          if (valueA < valueB) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;
        }
        return 0;
      })
    : [];

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
    <Layout>
      <Toaster />
      <SEO title="Provider Detail" />
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <section className=" py-5 px-5 lg:px-10 md:px-96">
          {provider ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <img
                src={provider.imageUrl}
                alt={provider.title}
                className="w-full h-48 object-cover mb-4 rounded-lg"
              />
              <h1 className="text-2xl font-bold text-center">
                {provider.title}
              </h1>
              <h2 className="text-sm text-center text-gray-500">
                {provider.description}
              </h2>
              <h2 className="text-sm text-center text-gray-500">
                {provider.address}
              </h2>
              <p className="text-sm text-center text-gray-500">
                {provider.phone}
              </p>
              <h2 className="text-lg font-semibold my-8">
                List Services by {provider.title}:
              </h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-100">
                      <th
                        className="border border-gray-200 px-4 py-2"
                        onClick={() => handleSort("title")}
                      >
                        Title
                        {sortBy === "title" && (
                          <>
                            {sortOrder === "asc" ? (
                              <FiChevronUp className="ml-1 inline" />
                            ) : (
                              <FiChevronDown className="ml-1 inline" />
                            )}
                          </>
                        )}
                      </th>
                      <th
                        className="border border-gray-200 px-4 py-2"
                        onClick={() => handleSort("description")}
                      >
                        Description
                        {sortBy === "description" && (
                          <>
                            {sortOrder === "asc" ? (
                              <FiChevronUp className="ml-1 inline" />
                            ) : (
                              <FiChevronDown className="ml-1 inline" />
                            )}
                          </>
                        )}
                      </th>
                      <th
                        className="border border-gray-200 px-4 py-2"
                        onClick={() => handleSort("price")}
                      >
                        Price
                        {sortBy === "price" && (
                          <>
                            {sortOrder === "asc" ? (
                              <FiChevronUp className="ml-1 inline" />
                            ) : (
                              <FiChevronDown className="ml-1 inline" />
                            )}
                          </>
                        )}
                      </th>
                      <th
                        className="border border-gray-200 px-4 py-2"
                        onClick={() => handleSort("openDate")}
                      >
                        Open Date
                        {sortBy === "openDate" && (
                          <>
                            {sortOrder === "asc" ? (
                              <FiChevronUp className="ml-1 inline" />
                            ) : (
                              <FiChevronDown className="ml-1 inline" />
                            )}
                          </>
                        )}
                      </th>
                      <th
                        className="border border-gray-200 px-4 py-2"
                        onClick={() => handleSort("openDateTime")}
                      >
                        Open Time
                        {sortBy === "openDateTime" && (
                          <>
                            {sortOrder === "asc" ? (
                              <FiChevronUp className="ml-1 inline" />
                            ) : (
                              <FiChevronDown className="ml-1 inline" />
                            )}
                          </>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentServices.map((service) => (
                      <tr key={service.id}>
                        <td className="border border-gray-200 px-4 py-2">
                          {service.title}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {service.description}
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-end">
                          ${service.price}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
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
                        <td className="border border-gray-200 px-4 py-2">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                    {
                      length: Math.ceil(
                        sortedServices.length / servicesPerPage
                      ),
                    },
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
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}
