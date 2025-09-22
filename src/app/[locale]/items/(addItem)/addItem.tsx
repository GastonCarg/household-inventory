import { useAddItem } from "@/hooks/useItems";

import { Check, Loader2, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { toast } from "react-toastify";

import { useGetLocations } from "@/hooks/useLocations";
import { IAddItem } from "../type";
import { IAddItemModal, ILocations } from "./type";

const AddItemModal: React.FC<IAddItemModal> = ({ closeModal }) => {
  const t = useTranslations("AddItemModal");

  const { data: locations, status, error } = useGetLocations();
  const mutation = useAddItem(closeModal);

  const handleSubmit = async (formData: FormData) => {
    try {
      const name = formData.get("name")?.toString() || "";
      const expiration = formData.get("expiration")?.toString() || "";
      const location = formData.get("location")?.toString() || "";
      const quantityStr = formData.get("quantity")?.toString() || "";
      const quantity = parseInt(quantityStr, 10);

      if (
        !name ||
        !expiration ||
        !location ||
        !quantityStr ||
        isNaN(quantity) ||
        quantity < 1
      ) {
        toast.warning(t("PleaseFillAllFields"));
        return;
      }

      const date = new Date();
      if (expiration) {
        const days = parseInt(expiration, 10);
        date.setDate(date.getDate() + days);
      }

      const item: IAddItem = {
        title: name,
        expireDate: date.toISOString(),
        location: location,
        quantity: quantity,
      };
      mutation.mutate(item);
    } catch (error) {
      toast.error(t("ErrorAddingItem"));
      console.error(t("ErrorAddingItemLog"), error);
    }
  };

  if (mutation.isPending) {
    return (
      <div className="flex items-center justify-center gap-2 mb-2">
        <Loader2 size={48} className="animate-spin text-green-700" />
      </div>
    );
  }

  if (status === "pending") {
    return <div>Cargando locations</div>;
  }

  if (error || !locations.length) {
    return <div>Error al cargar locations</div>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-white p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={t("Close")}
          disabled={mutation.isPending}
        >
          <X size={24} />
        </button>
        <Form
          data-testid="addItemForm"
          action={handleSubmit}
          className="flex flex-col gap-4 sm:gap-6"
        >
          <section className="flex items-center justify-center gap-2 mb-2">
            <Plus size={24} className="text-green-700" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight text-center">
              {t("AddItem")}
            </h2>
          </section>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm sm:text-base font-semibold text-gray-700"
            >
              {t("ProductName")}:
            </label>
            <input
              id="name"
              name="name"
              placeholder={t("ProductName")}
              className="border border-gray-300 p-3 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[44px]"
              autoComplete="on"
              autoFocus
              disabled={mutation.isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="quantity"
              className="text-sm sm:text-base font-semibold text-gray-700"
            >
              {t("Quantity")}:
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="1"
              className="border border-gray-300 p-3 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[44px]"
              min="1"
              disabled={mutation.isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="expiration"
              className="text-sm sm:text-base font-semibold text-gray-700"
            >
              {t("Expiration")}:
            </label>
            <input
              id="expiration"
              name="expiration"
              type="number"
              placeholder="30"
              className="border border-gray-300 p-3 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[44px]"
              min="1"
              disabled={mutation.isPending}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="location"
              className="text-sm sm:text-base font-semibold text-gray-700"
            >
              {t("Location")}:
            </label>
            <select
              id="location"
              name="location"
              className="border border-gray-300 p-3 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-green-500 outline-none transition-all min-h-[44px]"
              disabled={mutation.isPending}
            >
              {locations.map((location: ILocations) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors min-h-[44px] order-2 sm:order-1"
              disabled={mutation.isPending}
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 font-semibold shadow-md hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px] order-1 sm:order-2"
              disabled={mutation.isPending}
            >
              <Check size={20} />
              {t("Submit")}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddItemModal;
