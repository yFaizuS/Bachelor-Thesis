import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout/Index";
import SEO from "@/components/Seo";
import { getAllServices } from "./api/service";
import {
  FaUser,
  FaMapMarkerAlt,
  FaDollarSign,
  FaStar,
  FaComment,
} from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { ImProfile } from "react-icons/im";

export default function Home() {
  const [allServices, setAllServices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getAllServices();
        setAllServices(servicesData);
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

  useEffect(() => {
    if (allServices.length > 0) {
      const minPrice = router.query.minprice;
      const maxPrice = router.query.maxprice;
      const search = router.query.search;
      if (minPrice || maxPrice || search) {
        setMinPriceFilter(minPrice || "");
        setMaxPriceFilter(maxPrice || "");
        setSearchQuery(search || "");
        const filteredServices = allServices.filter(
          (service) =>
            (!minPrice || service.price >= parseInt(minPrice)) &&
            (!maxPrice || service.price <= parseInt(maxPrice)) &&
            (!search ||
              service.title.toLowerCase().includes(search.toLowerCase()))
        );
        setServices(filteredServices);
      } else {
        setServices(allServices);
      }
    }
  }, [
    allServices,
    router.query.minprice,
    router.query.maxprice,
    router.query.search,
  ]);

  const limitDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 30) {
      return words.slice(0, 30).join(" ") + "...";
    } else {
      return description;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    if (name === "minprice") {
      setMinPriceFilter(value);
    } else if (name === "maxprice") {
      setMaxPriceFilter(value);
    }
    router.push({
      pathname: "/",
      query: {
        minprice: name === "minprice" ? value : minPriceFilter,
        maxprice: name === "maxprice" ? value : maxPriceFilter,
        search: searchQuery,
      },
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    router.push({
      pathname: "/",
      query: {
        minprice: minPriceFilter,
        maxprice: maxPriceFilter,
        search: searchQuery,
      },
    });
  };

  const ITEMS_PER_PAGE = 6;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = services.slice(startIndex, endIndex);

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);

  return (
    <Layout>
      <Toaster />
      <SEO title="Card" />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <section className="px-5 md:px-64">
          <div className="flex justify-end my-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border rounded-md p-1 mr-2"
            />
            <button
              onClick={handleSearch}
              className="px-2 py-1 rounded-md bg-orange-500 text-white"
            >
              Search
            </button>
            <label htmlFor="minprice" className="ml-4 mr-2">
              Filter by Min Price:
            </label>
            <select
              id="minprice"
              className="border rounded-md p-1"
              value={minPriceFilter}
              name="minprice"
              onChange={handlePriceChange}
            >
              <option value="">All</option>
              <option value="10">$10</option>
              <option value="20">$20</option>
              <option value="30">$30</option>
              <option value="40">$40</option>
              <option value="50">$50</option>
            </select>
            <label htmlFor="maxprice" className="ml-2 mr-2">
              Filter by Max Price:
            </label>
            <select
              id="maxprice"
              className="border rounded-md p-1"
              value={maxPriceFilter}
              name="maxprice"
              onChange={handlePriceChange}
            >
              <option value="">All</option>
              <option value="100">$100</option>
              <option value="200">$200</option>
              <option value="300">$300</option>
              <option value="400">$400</option>
              <option value="500">$500</option>
            </select>
          </div>
          {currentItems.length === 0 ? (
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
                Change your filter!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
              {currentItems.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-40 bg-gray-200 rounded-md mb-4">
                      <ImProfile className="text-4xl text-gray-500" />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h2>
                  <p className="text-gray-700 mb-4">
                    {limitDescription(service.description)}
                  </p>
                  <div className="flex items-center mb-2">
                    <FaUser className="text-orange-500 mr-2" />
                    <p className="text-orange-500 font-semibold">
                      {service.providerTitle}
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-orange-500 mr-2" />
                    <p className="text-orange-500 font-semibold">
                      {service.providerAddress}
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaDollarSign className="text-orange-500 mr-2" />
                    <p className="text-orange-500 font-semibold">
                      ${service.price}
                    </p>
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
                    <button className="py-2 px-2 rounded-md hover:font-bold bg-orange-500 hover:bg-orange-600 text-white">
                      <a href={`/${service.id}`}>Check Detail</a>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {currentItems.length > 0 && (
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
          )}
        </section>
      )}
    </Layout>
  );
}
