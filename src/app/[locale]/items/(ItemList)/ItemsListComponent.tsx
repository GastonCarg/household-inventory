import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

import { CARD_LEFT_BORDER, STATUS_COLOR_MAP } from "@/(constants)";
import { Card } from "@/components";
import { formatDate, getExpirationDaysLeft } from "@/lib/helpers";
import { ItemsListComponentProps } from "../type";

export function ItemsListComponent({
  item,
  removeItem,
  editItem,
}: ItemsListComponentProps) {
  const t = useTranslations("ItemsList");
  const { locale } = useParams();
  const lang = locale === "es" && "es-AR";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { title, expireDate, quantity, location, id } = item;
  const daysLeft = getExpirationDaysLeft(expireDate ?? "");
  let textDaysLeft = `${daysLeft} ${t("DaysLeft")}`;
  const status =
    daysLeft <= 0 ? "error" : daysLeft <= 3 ? "warning" : "success";
  if (daysLeft <= 0) {
    textDaysLeft = t("Expired");
  }

  return (
    <Card
      key={id}
      props={`group relative ${CARD_LEFT_BORDER[status] ?? ""}`}
      aria-label={title}
      tabIndex={0}
    >
      <div className="absolute top-3 right-3 z-10 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-[#404460] hover:text-[#F2F4FF] hover:bg-[#1E2130] rounded-lg flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#deff6ecc] focus-visible:ring-offset-1"
            aria-label={`${t("Actions")} ${title}`}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            type="button"
          >
            <MoreVertical size={16} />
          </button>
          {isMenuOpen && (
            <div
              role="menu"
              aria-label={`${t("Actions")} ${title}`}
              className="absolute right-0 top-full mt-1 bg-[#1A1D28] border border-[#252836] rounded-xl shadow-lg z-20 overflow-hidden"
            >
              <button
                onClick={() => {
                  editItem(item);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-[#C4CBE8] hover:bg-[#1E2130] transition-colors"
                role="menuitem"
                aria-label={`${t("Edit")} ${title}`}
              >
                <Pencil size={14} className="text-[#8A90AB]" />
                <span className="text-sm font-medium">{t("Edit")}</span>
              </button>
              <button
                onClick={() => {
                  removeItem(id!);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-red-400 hover:bg-red-950/40 transition-colors"
                role="menuitem"
                aria-label={`${t("Delete")} ${title}`}
              >
                <Trash2 size={14} />
                <span className="text-sm font-medium">{t("Delete")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <Card.Header props="flex justify-between my-0 pb-3">
        <div className="flex items-center flex-1 min-w-0 pr-6">
          <div
            aria-label="dishes icon"
            className="flex mr-3 h-10 w-10 items-center justify-center text-2xl bg-[#1C1F2E] rounded-xl shrink-0"
          >
            🍽️
          </div>
          <section className="min-w-0">
            <h2
              className="text-base sm:text-lg font-semibold text-[#F0F2FF] flex-1 pr-2 truncate leading-tight"
              style={{ fontFamily: "var(--font-product)" }}
            >
              {title}
            </h2>
            {quantity && (
              <p
                className="text-xs text-[#8A90AB] mt-0.5 font-medium"
                aria-label={`${t("Quantity")}: ${quantity}`}
              >
                {t("Quantity")}:{" "}
                <span className="text-[#C4CBE8] font-semibold">{quantity}</span>
              </p>
            )}
          </section>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-2">
          {expireDate && (
            <div className="flex items-center gap-1.5 text-xs text-[#8A90AB]">
              <Calendar
                size={13}
                className="text-[#404460] shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">
                {`${t("Expires")}: ${formatDate(expireDate, lang?.toString())}`}
              </span>
            </div>
          )}
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex flex-row items-center gap-2 w-full flex-wrap">
          {location && (
            <div className="flex justify-center px-3 my-1 border rounded-full h-7 bg-indigo-500/15 border-indigo-400/30">
              <div className="flex items-center justify-center gap-1.5 text-xs">
                <MapPin
                  size={11}
                  className="text-indigo-300 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate font-medium text-indigo-300">
                  {location.name}
                </span>
              </div>
            </div>
          )}
          <span
            className={`flex items-center justify-center h-7 gap-1 text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLOR_MAP[status].expiredText} ${STATUS_COLOR_MAP[status].bg ?? "transparent"} border ${STATUS_COLOR_MAP[status].border ?? "border-transparent"}`}
          >
            <Clock size={10} aria-hidden="true" />
            <span>{daysLeft <= 0 ? t("Expired") : `${textDaysLeft}`}</span>
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
}
