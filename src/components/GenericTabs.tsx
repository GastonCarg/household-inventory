import { IGenericTabs } from "@/lib/types";
import React from "react";

const GenericTabs: React.FC<IGenericTabs> = ({
  title,
  action,
  buttonPressed,
  isFilter,
  children,
}) => {
  return (
    <button
      id={title}
      className={`flex items-center justify-center min-w-fit px-4 py-3 sm:py-4 border-b-2 whitespace-nowrap ${buttonPressed === title ? "border-green-500 text-green-600" : "border-transparent text-gray-500"} ${isFilter && "ml-auto"} transition-colors hover:bg-gray-50 active:bg-gray-100`}
      onClick={() => action(title)}
    >
      {children}
      <span className="text-sm sm:text-base">{title}</span>
    </button>
  );
};

export default GenericTabs;
