import { CircleX, Package, TriangleAlert } from "lucide-react";

export const ITEMS_URL = "http://localhost:3001";

export const COLOR_TEXT_MAP: Record<string, string> = {
  black: "text-black-500",
  orange: "text-orange-500",
  red: "text-red-500",
  green: "text-green-600",
};

export const COLOR_BACKGROUND_MAP: Record<string, string> = {
  black: "bg-black-100",
  orange: "bg-orange-100",
  red: "bg-red-100",
  green: "bg-green-100",
  transparent: "bg-transparent",
};

export const COLOR_BORDER_MAP: Record<string, string> = {
  black: "border-black-200",
  orange: "border-orange-200",
  red: "border-red-200",
  green: "border-green-300",
};

export const STATUS_COLOR_MAP: Record<
  string,
  { text: string; bg: string; border: string; bgSummary: string }
> = {
  default: {
    text: "text-blue-500",
    bg: "bg-blue-100",
    bgSummary: "bg-blue-500",
    border: "border-blue-200",
  },
  warning: {
    text: "text-orange-500",
    bg: "bg-orange-100",
    bgSummary: "bg-orange-500",
    border: "border-orange-200",
  },
  error: {
    text: "text-red-500",
    bg: "bg-red-100",
    bgSummary: "bg-red-500",
    border: "border-red-200",
  },
  success: {
    text: "text-green-600",
    bg: "bg-green-100",
    bgSummary: "bg-green-500",
    border: "border-green-300",
  },
};

export const STATUS_ICON_MAP: Record<string, React.ElementType> = {
  default: Package,
  warning: TriangleAlert,
  error: CircleX,
};
