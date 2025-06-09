import Form from "next/form";
import { useState } from "react";
import { toast } from "react-toastify";

import { addItem } from "@/api/items";
import { Item } from "../type";
import { IAddItemModal } from "./type";

const AddItemModal: React.FC<IAddItemModal> = ({ closeModal }) => {
  const [loading, setLoading] = useState(false);

  const locations = ["Refrigerator", "Fridge"];

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const name = formData.get("name")?.toString() || "";
      let expiration = formData.get("expiration")?.toString() || "";
      const location = formData.get("location")?.toString() || "";

      if (!name || !expiration || !location) {
        toast.warning("Please fill in all fields.");
        return;
      }

      const date = new Date();
      if (expiration) {
        const days = parseInt(expiration, 10);
        date.setDate(date.getDate() + days);
      }

      const item: Item = {
        title: name,
        expireDate: date.toISOString(),
        location: location,
      };

      addItem(item);
      closeModal();

      toast.success("Item added successfully!", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      formData.set("name", "");
      formData.set("expiration", "");
      formData.set("location", locations[0]);
    } catch (error) {
      toast.error("An error occurred while adding the item. Please try again.");
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold">Adding Item...</h2>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
      <Form action={handleSubmit} className="flex flex-col gap-4">
        <section className="flex items-center justify-center">
          <h2 className="text-2xl font-bold">Add Item</h2>
        </section>
        <label id="name" className="text-lg font-semibold">
          Product name:
        </label>
        <input
          name="name"
          placeholder="Product name"
          className="border p-2 rounded"
          required
          autoComplete="on"
        />
        <label id="expiration" className="text-lg font-semibold">
          Expiration date (in days):
        </label>
        <input
          name="expiration"
          type="number"
          placeholder="30"
          className="border p-2 rounded border-gray-300"
          required
          min="1"
        />
        <label id="location" className="text-lg font-semibold">
          Location:
        </label>
        <select name="location" className="border p-2 rounded" required>
          {locations.map((location, idx) => (
            <option key={idx} value={location}>
              {location}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AddItemModal;
