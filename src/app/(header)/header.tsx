"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { lazy, useState } from "react";

// TODO: add import alias
import SearchComponent from "../(search)/searchComponent";

const ItemModal = lazy(() => import("../[locale]/items/(addItem)/addItem"));

const Header = () => {
  const [addItemModal, setAddItemModal] = useState(false);
  const t = useTranslations("Header");

  const openModal = () => {
    setAddItemModal(true);
  };

  const closeModal = () => {
    setAddItemModal(false);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-300 bg-white">
      <label className="p-4 text-2xl font-bold">
        {t("HouseholdInventory")}
      </label>
      <section className="grid grid-flow-col gap-4 p-4">
        <SearchComponent />
        <button
          className="rounded-md bg-green-600 border-none p-2 text-white flex items-center gap-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onMouseUp={openModal}
        >
          <Plus className="h-5 w-5 text-white" />
          <span>{t("AddItem")}</span>
        </button>
      </section>
      {addItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <ItemModal closeModal={closeModal} />
        </div>
      )}
    </header>
  );
};

export default Header;
