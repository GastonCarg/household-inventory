"use client";

import { IFilterSearch } from "@/lib/types";
import React, { createContext, useState } from "react";

interface ISearchContext {
  searchValue: string;
  handleSetSearchValue: (value: string) => void;
  statusFilter: IFilterSearch;
  handleSetStatusFilter: (status: IFilterSearch) => void;
  filterByStatus: (expireDate: string) => IFilterSearch;
}

const SearchContext = createContext<ISearchContext>({
  searchValue: "",
  handleSetSearchValue: () => {},
  statusFilter: { status: "all" },
  handleSetStatusFilter: () => {},
  filterByStatus: () => ({ status: "all" }),
});

export const SearchContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<IFilterSearch>({
    status: "all",
  });

  const filterByStatus = (expireDate: string): IFilterSearch => {
    const now = new Date();
    const expire = new Date(expireDate);
    const diffDays = Math.ceil(
      (expire.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= 0) return { status: "expired" };
    if (diffDays >= 1 && diffDays <= 3) return { status: "expiringSoon" };
    if (diffDays > 3) return { status: "ok" };
    return { status: "all" };
  };

  const handleSetStatusFilter = (status: IFilterSearch) => {
    setStatusFilter(status);
  };

  const handleSetSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const value = {
    searchValue,
    handleSetSearchValue,
    statusFilter,
    handleSetStatusFilter,
    filterByStatus,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export default SearchContext;
