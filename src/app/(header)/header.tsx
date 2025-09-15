"use client";
import { lazy, useState } from "react";

import { Home, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <header className="flex flex-col sm:flex-row h-auto sm:h-16 items-start sm:items-center justify-between border-b border-gray-300 bg-white p-4 gap-4">
      <div className="flex items-center justify-center gap-2">
        <section className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Home className="h-5 w-5 text-white" />
        </section>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {t("HouseholdInventory")}
          </h3>
          <p className="text-sm text-slate-500 hidden sm:block">
            {t("ManageHomeEssentials")}
          </p>
        </div>
      </div>
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto order-2 sm:order-none">
        <SearchComponent />
        <button
          className="rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg border-none p-3 sm:p-2 text-white flex items-center justify-center gap-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors min-h-[44px] sm:min-h-0"
          onMouseUp={openModal}
        >
          <Plus className="h-4 w-4 text-white" />
          <span className="text-sm sm:text-base">{t("AddItem")}</span>
        </button>
      </section>
      {addItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <ItemModal closeModal={closeModal} />
        </div>
      )}
    </header>
  );
};

export default Header;
