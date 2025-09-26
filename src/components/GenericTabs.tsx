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
      className={`flex items-center justify-center h-8 px-4 py-3 sm:py-4 border-b-2 rounded-md whitespace-nowrap ${buttonPressed === title ? "bg-blue-500 text-white" : "border-transparent text-gray-500"} ${isFilter && "ml-auto"} transition-colors`}
      onClick={() => action(title)}
    >
      {children}
      <span className="text-sm sm:text-base">{title}</span>
    </button>
  );
};

export default GenericTabs;
