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
  title,
  count,
  expireDate,
  newProduct,
  location,
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
    if (lowerTitle.includes("expired")) {
      color = "red";
    } else if (lowerTitle.includes("soon")) {
      color = "orange";
    } else {
      color = "black";
    }
  }

  const colorClass = color
    ? COLOR_TEXT_MAP[color] || "text-black"
    : "text-black";

  if (newProduct) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-500 bg-gray-300 p-4 shadow-md">
        <label id="title" className="text-gray-500">
          {title}
        </label>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-24 flex-col justify-between rounded-md border border-gray-300 bg-white p-4 shadow-md ${expireDate && COLOR_BORDER_MAP[color || "black"]}`}
    >
      <section className="flex column w-full items-center">
        <h2 className="text-md">{title}</h2>
        {textDaysLeft && (
          <span
            className={`flex items-center justify-center text-xs px-2 py-1 rounded-3xl ml-auto ${COLOR_BACKGROUND_MAP[color || "transparent"]} ${COLOR_TEXT_MAP[color || "black"]}`}
          >
            {textDaysLeft}
          </span>
        )}
      </section>
      {count && <p className={`font-bold text-3xl ${colorClass}`}>{count}</p>}
      {expireDate && (
        <p className="font-bold text-sm">Expires: {formatDate(expireDate)}</p>
      )}
      {location && (
        <p className="text-xs text-gray-500">Location: {location}</p>
      )}
    </div>
  );
};

export default GenericCard;
