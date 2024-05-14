import LayoutAdmin from "@/components/LayoutAdmin/Index";
import SEO from "@/components/Seo";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { addProvider } from "../api/provider";
import { MdSave } from "react-icons/md";

export default function Provider() {
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    description: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", formData.image);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("phone", formData.phone);

    try {
      const response = await addProvider(data);
      if (response && response.success) {
        toast.success("Provider added successfully!");
      } else {
        toast.success("Provider added successfully!");
      }
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
  };

  return (
    <LayoutAdmin>
      <Toaster />
      <SEO title="Provider" />
      <section className="container mx-auto p-5 md:pl-32 h-screen">
        <div>
          <h1 className="font-bold text-2xl text-center">Add Provider</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="image"
                className="block text-gray-700 font-medium mb-2"
              >
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                required
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                value={formData.title}
                required
                placeholder="Title"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                value={formData.description}
                required
                placeholder="Description"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-gray-700 font-medium mb-2"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                value={formData.address}
                required
                placeholder="Address"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2"
              >
                Phone
              </label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                value={formData.phone}
                required
                placeholder="081928197219712"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end pt-5">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 flex items-center"
              >
                <MdSave className="h-5 w-5 mr-2" /> Save
              </button>
            </div>
          </form>
        </div>
      </section>
    </LayoutAdmin>
  );
}
