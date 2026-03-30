"use client";
import { Home, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext } from "react";

import { ItemModalContext } from "@/(contexts)";
import SearchComponent from "../(search)/searchComponent";

const Header = () => {
  const { openModal } = useContext(ItemModalContext);
  const t = useTranslations("Header");

  return (
    <header
      aria-label="banner header"
      className="flex flex-col sm:flex-row h-auto sm:h-[72px] items-start sm:items-center justify-between bg-surface border-b border-divider px-6 py-4 gap-4"
    >
      <div className="flex items-center justify-center gap-3">
        <section className="p-2.5 bg-[#deff6ecc] rounded-xl" aria-hidden="true">
          <Home className="h-5 w-5 text-[#090A0F]" />
        </section>
        <div>
          <h3
            aria-label="project name"
            className="text-2xl font-bold text-fg tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("HouseholdInventory")}
          </h3>
          <p
            aria-label="description"
            className="text-xs text-fg-muted hidden sm:block font-medium tracking-wide uppercase"
          >
            {t("ManageHomeEssentials")}
          </p>
        </div>
      </div>
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 w-full sm:w-auto order-2 sm:order-none">
        <SearchComponent />
        <button
          className="rounded-xl bg-primary hover:bg-primary-dark active:bg-primary-active border-none px-5 py-2.5 text-bg flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all duration-150 min-h-[44px] sm:min-h-0 font-semibold"
          onClick={openModal}
          type="button"
        >
          <Plus className="h-4 w-4 text-bg" />
          <span className="text-sm">{t("AddItem")}</span>
        </button>
      </section>
    </header>
  );
};

export default Header;
