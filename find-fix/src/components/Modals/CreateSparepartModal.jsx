import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { addSparePart } from "@/pages/api/order";

const CreateSparePartModal = ({ isOpen, closeModal, orderId }) => {
  const [spareParts, setSpareParts] = useState([
    { name: "", price: "", quantity: "" },
  ]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...spareParts];
    list[index][name] = value;
    setSpareParts(list);
  };

  const handleAddInput = () => {
    setSpareParts([...spareParts, { name: "", price: "", quantity: "" }]);
  };

  const handleRemoveInput = (index) => {
    const list = [...spareParts];
    list.splice(index, 1);
    setSpareParts(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSpareParts = spareParts.map(
        ({ name, price, quantity }) => ({
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
        })
      );
      await addSparePart(orderId, { spareParts: formattedSpareParts });
      toast.success("Spare part added successfully!");
      closeModal();
    } catch (error) {
      console.error("Error adding spare part: ", error);
      toast.error("Failed to add spare part");
    }
  };

  return (
    <>
      <Toaster />
      {isOpen && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Spare Part</h2>
            <form onSubmit={handleSubmit}>
              {spareParts.map((sparePart, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    name="name"
                    value={sparePart.name}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Spare Part Name"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={sparePart.price}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Price"
                    className="border border-gray-300 rounded-md p-2 mt-2 w-full"
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={sparePart.quantity}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Quantity"
                    className="border border-gray-300 rounded-md p-2 mt-2 w-full"
                    required
                  />
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveInput(index)}
                      className="text-red-500 mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddInput}
                className="text-blue-500"
              >
                + Add More
              </button>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSparePartModal;
