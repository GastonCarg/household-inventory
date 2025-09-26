import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { STATUS_COLOR_MAP } from "@/(constants)";
import { Card } from "@/components";
import { formatDate, getExpirationDaysLeft } from "@/lib/helpers";
import { useParams } from "next/navigation";
import { ItemsListComponentProps } from "../type";

export function ItemsListComponent({
  item,
  removeItem,
}: ItemsListComponentProps) {
  const t = useTranslations("ItemsList");
  const { locale } = useParams();
  const lang = locale === "es" && "es-AR";

  const { title, expireDate, quantity, location, id } = item;
  const daysLeft = getExpirationDaysLeft(expireDate ?? "");
  let textDaysLeft = `${daysLeft} ${t("DaysLeft")}`;
  const status =
    daysLeft <= 0 ? "error" : daysLeft <= 3 ? "warning" : "success";
  if (daysLeft <= 0) {
    textDaysLeft = t("Expired");
  }

  return (
    <Card key={id} props="group relative">
      <Card.Header props="flex justify-between my-0 pb-4">
        <div className="flex items-center flex-1 min-w-0">
          <div
            aria-label="dishes icon"
            className="flex mr-4 h-10 w-10 items-center justify-center text-3xl"
          >
            🍽️
          </div>
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex-1 pr-2 truncate">
              {title}
            </h2>
            {quantity && (
              <div className="flex items-center gap-2 sm:text-sm text-gray-600">
                <p
                  className="text-sm"
                  aria-label={`${t("Quantity")}: ${quantity}`}
                >
                  <span aria-hidden="true">{t("Quantity")}:</span> {quantity}
                </p>
              </div>
            )}
          </section>
        </div>
        <div className="flex md:hidden group-hover:flex">
          <div className="flex justify-end">
            <button
              onClick={() => removeItem(id!)}
              className="p-2 text-gray-400 text-red-500 hover:text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Delete item"
              title="Delete item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-2">
          {expireDate && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Calendar size={18} className="text-gray-500 shrink-0" />
              <span className="truncate text-md sm:text-xs">
                {`${t("Expires")}: ${formatDate(expireDate, lang?.toString())}`}
              </span>
            </div>
          )}
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex flex-row items-center gap-2 w-full">
          {location && (
            <div
              className={`flex justify-center px-4 my-2 border-1 rounded-full h-8 ${location.bgColor ?? "bg-gray-100"} ${location.borderColor ?? "border-gray-400"} border`}
            >
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                <MapPin size={14} className="text-gray-500 shrink-0" />
                <span className={`truncate ${location.textColor ?? ""}`}>
                  {location.name}
                </span>
              </div>
            </div>
          )}
          <span
            className={`flex items-center justify-center h-8 gap-1 text-xs px-4 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium ${STATUS_COLOR_MAP[status].expiredText} ${STATUS_COLOR_MAP[status].bg ?? "transparent"} border ${STATUS_COLOR_MAP[status].border ?? "border-transparent"}`}
          >
            <Clock size={12} />
            <p>{daysLeft <= 0 ? t("Expired") : `${textDaysLeft}`}</p>
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
}
