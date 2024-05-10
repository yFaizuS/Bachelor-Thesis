import { useEffect, useState } from "react";
import Layout from "@/components/Layout/Index";
import SEO from "@/components/Seo";
import { getAllServices } from "./api/card";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(16000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const convertToDollar = (priceInRupiah, exchangeRate) => {
    return priceInRupiah / exchangeRate;
  };

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

  const ITEMS_PER_PAGE = 6;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = services.slice(startIndex, endIndex);

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);

  return (
    <Layout>
      <SEO title="Card" />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <section className="px-5 md:px-64">
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
            {currentItems.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
                <p className="text-base font-semibold mb-2">
                  {service.address}
                </p>
                <p className="text-gray-700 mb-4">
                  {limitDescription(service.description)}
                </p>
                <p className="text-orange-500 font-semibold mb-2">
                  Provider: {service.provider}
                </p>
                <p className="text-orange-500 font-semibold">
                  Price: $
                  {convertToDollar(service.price, exchangeRate).toFixed(0)}
                </p>
                <div className="flex justify-end">
                  <button className="py-2 px-2 rounded-md hover:font-bold bg-orange-500 hover:bg-orange-600 text-white">
                    <a href={`/card/${service.id}`}>Check Detail</a>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
        </section>
      )}
    </Layout>
  );
}
