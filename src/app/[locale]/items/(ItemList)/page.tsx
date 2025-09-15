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
    <Card key={id}>
      <Card.Header>
        <>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-2">
            {title}
          </h2>
          <span
            className={`flex items-center gap-1 text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium ${STATUS_COLOR_MAP[status].bg ?? "transparent"} ${STATUS_COLOR_MAP[status].text}`}
          >
            <Clock size={12} />
            <span className="hidden sm:inline">{textDaysLeft}</span>
            <span className="sm:hidden">
              {daysLeft <= 0 ? t("Expired") : `${daysLeft}d`}
            </span>
          </span>
        </>
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

          {quantity && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Package size={14} className="text-gray-500 shrink-0" />
              <span>Quantity: {quantity}</span>
            </div>
          )}

          {location && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <MapPin size={14} className="text-gray-500 shrink-0" />
                <span className="truncate">{location.name}</span>
              </div>
            </div>
          )}
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => removeItem(id!)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Delete item"
            title="Delete item"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
}
