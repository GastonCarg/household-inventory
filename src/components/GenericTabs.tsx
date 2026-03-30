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
      role="tab"
      aria-selected={buttonPressed === title}
      className={`flex items-center justify-center h-8 px-4 py-3 sm:py-4 border-b-2 rounded-xl whitespace-nowrap font-medium text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-bg ${buttonPressed === title ? "bg-primary text-bg border-primary shadow-sm" : "border-transparent text-fg-muted hover:text-fg hover:bg-muted"} ${isFilter && "ml-auto"}`}
      onClick={() => action(title)}
    >
      {children}
      <span className="text-sm sm:text-base">{title}</span>
    </button>
  );
};

export default GenericTabs;
