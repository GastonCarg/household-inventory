import Form from "next/form";
import { IAddItemModal } from "./type";

const AddItemModal: React.FC<IAddItemModal> = ({ closeModal }) => {
  const locations = ["Refrigerator", "Fridge"];

  // TODO: Add validations
  return (
    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
      <Form action="/" className="flex flex-col gap-4">
        <section className="flex items-center justify-center">
          <h2 className="text-2xl font-bold">Add Item</h2>
        </section>
        <label htmlFor="name" className="text-lg font-semibold">
          Product name:
        </label>
          <input
          id="name"
          placeholder="Product name"
          className="border p-2 rounded"
        />
        <label htmlFor="name" className="text-lg font-semibold">
          Expiration date (in days):
        </label>
        <input
          id="expiration"
          type="number"
          placeholder="30"
          className="border p-2 rounded border-gray-300"
        />
        <label htmlFor="name" className="text-lg font-semibold">
          Location:
        </label>
        <select id="location" className="border p-2 rounded">
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
            onClick={closeModal}
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
