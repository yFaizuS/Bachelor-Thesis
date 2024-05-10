import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getOrderById } from "../api/order";
import { getToken } from "@/hooks/useToken";
import {
  BsStarFill,
  BsStar,
  BsGeoAltFill,
  BsCreditCardFill,
  BsCreditCard,
} from "react-icons/bs";
import { RiCellphoneFill } from "react-icons/ri";
import { MdLocalShipping } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import LayoutAdmin from "@/components/LayoutAdmin/Index";
import SEO from "@/components/Seo";

export default function OrdersById() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(16000);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Token not found");
        }

        if (id) {
          const orderData = await getOrderById(id);
          setOrder(orderData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching order data: ", error);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const convertToDollar = (priceInRupiah, exchangeRate) => {
    return priceInRupiah / exchangeRate;
  };

  return (
    <LayoutAdmin>
      <SEO title="Order Detail" />
      <section className="container mx-auto p-5 md:pl-32 h-screen">
        <h1 className="text-2xl font-bold mb-4">History Order Detail</h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            <div className="flex flex-col md:flex-row bg-gray-50 px-4 py-5 gap-5 sm:px-6">
              <img
                src={order.serviceImageUrl}
                alt={order.serviceName}
                width={400}
                height={400}
                className="rounded-md mb-4"
              />
              <div className="space-y-5">
                <div className="text-xl font-semibold">{order.serviceName}</div>
                <div className="flex gap-3 mb-2 text-lg">
                  <MdLocalShipping className="mt-1" />
                  Status <span className="font-bold">{order.status}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <RiCellphoneFill className="mt-1" />
                  Phone
                  <span className="font-bold"> {order.phone}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <BsGeoAltFill className="mt-1" />
                  Address <span className="font-bold">{order.address}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <AiOutlineShoppingCart className="mt-1" />
                  Quantity <span className="font-bold"> {order.quantity}</span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <BsCreditCardFill className="mt-1" />
                  Price
                  <span className="font-bold">
                    ${convertToDollar(order.price, exchangeRate).toFixed(0)}
                  </span>
                </div>
                <div className="flex gap-3 mb-2 text-lg">
                  <BsCreditCard className="mt-1" />
                  Total
                  <span className="font-bold">
                    ${convertToDollar(order.total, exchangeRate).toFixed(0)}
                  </span>
                </div>
                {order.rating && (
                  <div className="flex gap-3 mb-2 text-lg">
                    <BsStar className="mt-1" />
                    Rating
                    {[...Array(order.rating)].map((_, index) => (
                      <BsStarFill
                        key={index}
                        className="text-yellow-500 mt-1"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </LayoutAdmin>
  );
}
