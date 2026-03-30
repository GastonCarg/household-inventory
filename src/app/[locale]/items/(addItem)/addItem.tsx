import { UI_CLASSES } from "@/(constants)";
import { useAddItem, useUpdateItem } from "@/hooks/useItems";
import { useGetLocations } from "@/hooks/useLocations";
import { getExpirationDaysLeft } from "@/lib/helpers";
import { Check, Loader2, Pencil, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Item } from "../type";
import { IAddItemModal, ILocations } from "./type";

const AddItemModal: React.FC<IAddItemModal> = ({ closeModal, editingItem }) => {
  const t = useTranslations("AddItemModal");
  const isEditing = !!editingItem;

  const { data: locations, status, error } = useGetLocations();
  const createMutation = useAddItem(closeModal);
  const updateMutation = useUpdateItem(closeModal);
  const isLoading = isEditing
    ? updateMutation.isPending
    : createMutation.isPending;

  // State for form fields
  const [formData, setFormData] = useState({
    name: editingItem?.title || "",
    expiration: "",
    location: editingItem?.location?.id?.toString() || "",
    quantity: editingItem?.quantity?.toString() || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    quantity: "",
    expiration: "",
    location: "",
  });

  // Calculate days remaining from expiration date
  useEffect(() => {
    if (isEditing && editingItem?.expireDate) {
      const daysLeft = getExpirationDaysLeft(editingItem.expireDate);
      // Only set expiration if the item is not expired
      if (daysLeft > 0) {
        setFormData((prev) => ({
          ...prev,
          expiration: daysLeft.toString(),
        }));
      }
    }
  }, [editingItem, isEditing]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, expiration, location, quantity: quantityStr } = formData;
      const quantity = parseInt(quantityStr, 10);

      const newErrors = {
        name: !name ? t("NameRequired") : "",
        quantity:
          !quantityStr || isNaN(quantity) || quantity < 1
            ? t("QuantityRequired")
            : "",
        expiration: !expiration ? t("ExpirationRequired") : "",
        location: !location ? t("LocationRequired") : "",
      };

      if (Object.values(newErrors).some(Boolean)) {
        setErrors(newErrors);
        toast.warning(t("PleaseFillAllFields"));
        return;
      }

      let expireDate = "";
      if (expiration) {
        const date = new Date();
        const days = parseInt(expiration, 10);
        date.setDate(date.getDate() + days);
        expireDate = date.toISOString();
      }

      const locationObj = locations.find(
        (loc: ILocations) => loc.id.toString() === location,
      );

      const item: Item = {
        title: name,
        expireDate: expireDate,
        location: locationObj,
        quantity: quantity,
      };

      if (isEditing && editingItem?.id) {
        updateMutation.mutate({ id: editingItem.id, item });
      } else if (!isEditing) {
        createMutation.mutate(item);
      } else {
        toast.error(t("ErrorUpdatingItem"));
      }
    } catch (error) {
      toast.error(isEditing ? t("ErrorUpdatingItem") : t("ErrorAddingItem"));
      console.error(
        isEditing ? t("ErrorUpdatingItemLog") : t("ErrorAddingItemLog"),
        error,
      );
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const FOCUSABLE =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 mb-2">
        <Loader2 size={48} className="animate-spin text-primary" />
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        ref={containerRef}
        className="relative bg-surface-modal p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-surface-overlay"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-fg-dim hover:text-fg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-divider"
          aria-label={t("Close")}
          disabled={isLoading}
        >
          <X size={20} />
        </button>
        <form
          data-testid="addItemForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <section className="flex items-center justify-center gap-2 mb-1">
            {isEditing ? (
              <>
                <div className="p-2 bg-accent-edit-bg rounded-xl">
                  <Pencil size={18} className="text-accent-edit" />
                </div>
                <h2
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-bold text-fg tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t("EditItem")}
                </h2>
              </>
            ) : (
              <>
                <div
                  className="p-2 bg-accent-add-bg rounded-xl"
                  aria-hidden="true"
                >
                  <Plus size={18} className="text-primary" />
                </div>
                <h2
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-bold text-fg tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t("AddItem")}
                </h2>
              </>
            )}
          </section>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={UI_CLASSES.label}>
              {t("ProductName")}
            </label>
            <input
              id="name"
              name="name"
              placeholder={t("ProductName")}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={UI_CLASSES.input}
              autoComplete="on"
              autoFocus
              aria-required="true"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quantity"
              className="text-xs font-semibold text-fg-muted uppercase tracking-wider"
            >
              {t("Quantity")}
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className={UI_CLASSES.input}
              min="1"
              aria-required="true"
              disabled={isLoading}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="expiration"
              className="text-xs font-semibold text-fg-muted uppercase tracking-wider"
            >
              {t("Expiration")}
            </label>
            <input
              id="expiration"
              name="expiration"
              type="number"
              placeholder="30"
              value={formData.expiration}
              onChange={(e) => handleInputChange("expiration", e.target.value)}
              className={UI_CLASSES.input}
              min="1"
              disabled={isLoading}
            />
            {errors.expiration && (
              <p className="text-red-500 text-xs mt-1">{errors.expiration}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="location"
              className="text-xs font-semibold text-fg-muted uppercase tracking-wider"
            >
              {t("Location")}
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className={`${UI_CLASSES.input} cursor-pointer`}
              aria-required="true"
              disabled={isLoading}
            >
              <option value="">{t("SelectLocation")}</option>
              {locations.map((location: ILocations) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-1">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-3 bg-transparent border border-surface-overlay rounded-xl text-fg-muted hover:bg-divider hover:text-fg transition-all duration-150 min-h-[44px] order-2 sm:order-1 font-medium"
              disabled={isLoading}
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-5 py-3 bg-primary hover:bg-primary-dark text-bg rounded-xl flex items-center justify-center gap-2 font-semibold shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] order-1 sm:order-2"
              disabled={isLoading}
            >
              <Check size={18} />
              {isEditing ? t("UpdateItem") : t("Submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
