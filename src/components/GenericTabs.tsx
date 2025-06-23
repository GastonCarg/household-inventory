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
      className={`flex items-center justify-center min-w-30 p-4 border-b-2 ${buttonPressed === title ? "border-green-500 text-green-600" : "border-transparent text-gray-500"} ${isFilter && "ml-auto"}`}
      onClick={() => action(title)}
    >
      {children}
      <span>{title}</span>
    </button>
  );
};

export default GenericTabs;
