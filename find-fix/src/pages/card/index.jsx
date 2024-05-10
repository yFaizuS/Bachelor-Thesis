import { useEffect, useState } from "react";
import Layout from "@/components/Layout/Index";
import { getAllServices } from "../api/card";
import SEO from "@/components/Seo";

export default function Card() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const limitDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 30) {
      return words.slice(0, 30).join(" ") + "...";
    } else {
      return description;
    }
  };

  return (
    <Layout>
      <SEO title="Card" />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <section className="h-screen px-5 md:px-64">
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
            {services.map((service) => (
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
                <p className="text-gray-700 mb-4">
                  {limitDescription(service.description)}
                </p>
                <p className="text-orange-500 font-semibold mb-2">
                  Provider: {service.provider}
                </p>
                <p className="text-orange-500 font-semibold">
                  Price: {service.price}
                </p>
                <div className="flex justify-end">
                  <button className="py-2 px-2 rounded-md hover:font-bold bg-orange-500 hover:bg-orange-600 text-white">
                    <a href={`/card/${service.id}`}>Check Detail</a>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
