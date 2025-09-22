import { Calendar, Clock, MapPin, Package, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { STATUS_COLOR_MAP } from "@/(constants)";
import { Card } from "@/components";
import { formatDate, getExpirationDaysLeft } from "@/lib/helpers";
import { ItemsListComponentProps } from "../type";

export function ItemsListComponent({
  item,
  removeItem,
}: ItemsListComponentProps) {
  const t = useTranslations("ItemsList");

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
          <div className="flex mr-4 h-(-webkit-fill-available)">🍽️</div>
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-2 truncate">
              {title}
            </h2>
            {quantity && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Package size={12} className="text-gray-500 shrink-0" />
                <p className="text-xs">{`${t("Quantity")}: ${quantity}`}</p>
              </div>
            )}
          </section>
        </div>
        <div className="hidden group-hover:flex">
          <div className="flex justify-end">
            <button
              onClick={() => removeItem(id!)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Delete item"
              title="Delete item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="space-y-2">
          {expireDate && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Calendar size={14} className="text-gray-500 shrink-0" />
              <span className="truncate">
                Expires: {formatDate(expireDate)}
              </span>
            </div>
          )}

          {location && (
            <div
              className={`flex justify-center w-full my-2 border-1 rounded-full h-8 ${location.bgColor ?? "bg-gray-100"} ${location.borderColor ?? "border-gray-400"} border`}
            >
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                <MapPin size={14} className="text-gray-500 shrink-0" />
                <span className={`truncate ${location.textColor ?? ""}`}>
                  {location.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex flex-col w-full">
          <span
            className={`flex items-center justify-center gap-1 text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium ${STATUS_COLOR_MAP[status].text} ${STATUS_COLOR_MAP[status].bg ?? "transparent"} border ${STATUS_COLOR_MAP[status].border ?? "border-transparent"}`}
          >
            <Clock size={12} />
            <span>{daysLeft <= 0 ? t("Expired") : `${textDaysLeft}`}</span>
          </span>
        </div>
      </Card.Footer>
    </Card>
  );
}
