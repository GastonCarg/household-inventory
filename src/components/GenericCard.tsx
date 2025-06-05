import { formatDate } from "@/lib/helpers";
import React from "react";

interface GenericCardProps {
  title: string;
  count?: string;
  expireDate?: string;
  newProduct?: boolean;
  color?: string;
  location?: string;
}

const GenericCard: React.FC<GenericCardProps> = ({
  title,
  count,
  expireDate,
  newProduct,
  color,
  location,
}) => {
  const colorTextMap: Record<string, string> = {
    black: "text-black-500",
    orange: "text-orange-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
    green: "text-green-600",
  };

  const colorBackgroundMap: Record<string, string> = {
    black: "bg-black-100",
    orange: "bg-orange-100",
    yellow: "bg-yellow-100",
    red: "bg-red-100",
    green: "bg-green-100",
    transparent: "bg-transparent",
  };

  const colorBorderMap: Record<string, string> = {
    black: "border-black-200",
    orange: "border-orange-200",
    yellow: "border-yellow-200",
    red: "border-red-200",
    green: "border-green-300",
  };

  const colorClass = color ? colorTextMap[color] || "text-black" : "text-black";

  if (newProduct) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-500 bg-gray-300 p-4 shadow-md">
        <label className="text-gray-500">{title}</label>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-24 flex-col justify-between rounded-md border border-gray-300 bg-white p-4 shadow-md ${expireDate && colorBorderMap[color || "black"]}`}
    >
      <section className="flex column w-full items-center">
        <h2 className="text-md">{title}</h2>
        {expireDate && (
          <span
            className={`flex items-center justify-center text-xs px-2 py-1 rounded-3xl ml-auto ${colorBackgroundMap[color || "transparent"]} ${colorTextMap[color || "black"]}`}
          >
            7 days
          </span>
        )}
      </section>
      {count && <p className={`font-bold text-3xl ${colorClass}`}>{count}</p>}
      {expireDate && <p className="font-bold text-sm">Expires: {formatDate(expireDate)}</p>}
      {location && (
        <p className="text-xs text-gray-500">Location: {location}</p>
      )}
    </div>
  );
};

export default GenericCard;
