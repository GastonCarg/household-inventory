import { Calendar, Clock, MapPin, Package, Trash2 } from "lucide-react";
import React from "react";

import {
  COLOR_BACKGROUND_MAP,
  COLOR_BORDER_MAP,
  COLOR_TEXT_MAP,
} from "@/(constants)";
import { formatDate, getExpirationDaysLeft } from "@/lib/helpers";
import { IGenericCardProps } from "@/lib/types";
import { useTranslations } from "next-intl";

const GenericCard: React.FC<IGenericCardProps> = ({
  id,
  title,
  count,
  expireDate,
  newProduct,
  location,
  quantity,
  isDeletable = false,
  onDelete,
}) => {
  let color = "black";
  let textDaysLeft = "";
  const t = useTranslations("GenericCard");

  if (expireDate) {
    const daysLeft = getExpirationDaysLeft(expireDate);

    textDaysLeft = `${daysLeft} ${t("DaysLeft")}`;
    if (daysLeft <= 0) {
      color = "red";
      textDaysLeft = t("Expired");
    } else if (daysLeft <= 3) {
      color = "orange";
    } else {
      color = "green";
    }
  }

  if (count) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("expired") || lowerTitle.includes("vencido")) {
      color = "red";
    } else if (lowerTitle.includes("soon") || lowerTitle.includes("vencer")) {
      color = "orange";
    } else {
      color = "black";
    }
  }

  const colorClass = color
    ? COLOR_TEXT_MAP[color] || "text-black"
    : "text-black";

  const handleDelete = (id: string) => {
    if (onDelete) onDelete(id);
  };

  if (newProduct) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 p-6 shadow-sm hover:border-gray-500 transition-colors">
        <Package size={32} className="text-gray-400 mb-2" />
        <label id="title" className="text-gray-500 font-medium text-center">
          {title}
        </label>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-28 flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 ${expireDate && COLOR_BORDER_MAP[color || "black"]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
          {title}
        </h2>
        {textDaysLeft && (
          <span
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium ${COLOR_BACKGROUND_MAP[color || "transparent"]} ${COLOR_TEXT_MAP[color || "black"]}`}
          >
            <Clock size={12} />
            {textDaysLeft}
          </span>
        )}
      </div>

      <div className="flex-1">
        {count && (
          <p className={`font-bold text-3xl mb-2 ${colorClass}`}>{count}</p>
        )}

        <div className="space-y-2">
          {expireDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={14} className="text-gray-500" />
              <span>Expires: {formatDate(expireDate)}</span>
            </div>
          )}

          {quantity && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package size={14} className="text-gray-500" />
              <span>Quantity: {quantity}</span>
            </div>
          )}

          {location && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-gray-500" />
                <span>{location.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {isDeletable && (
        <div className="flex justify-end">
          <button
            onClick={() => handleDelete(id!)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Delete item"
            title="Delete item"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GenericCard;
