import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Index";
import { FiShoppingCart } from "react-icons/fi";
import { getServiceById } from "../api/card";
import SEO from "@/components/Seo";
import { checkoutAdd } from "../api/checkout";
import toast, { Toaster } from "react-hot-toast";

export default function ServiceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const serviceData = await getServiceById(id);
          setService(serviceData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, [id]);

  const handleCheckout = async () => {
    if (service) {
      try {
        await checkoutAdd(service.id);
        toast.success("Checkout successfully!");
        router.push("/checkout");
      } catch (error) {
        console.error("Error during checkout:", error);
        toast.error("Failed to checkout. Please try again later.");
      }
    }
  };

  return (
    <Layout>
      <Toaster />
      <SEO title={service ? service.title : "Loading..."} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <section className="md:h-screen py-5 px-5 lg:px-10 md:px-96">
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-48 object-cover mb-4 rounded-lg"
            />
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="font-bold text-gray-700 mb-4">{service.address}</p>
            <p className="text-gray-700 mb-4">{service.description}</p>
            <p className="text-orange-500 font-semibold mb-2">
              Provider: {service.provider}
            </p>
            <p className="text-orange-500 font-semibold">
              Price: {service.price}
            </p>
            <div className="flex justify-end">
              <button
                className="flex gap-2 py-2 px-2 rounded-md hover:font-bold bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleCheckout}
              >
                <FiShoppingCart size={24} />
                Checkout
              </button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
