'use client';

import React, { createContext, useState } from 'react';

const SearchContext = createContext({
  searchValue: '',
  handleSetSearchValue: (value: string) => {},
});

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSetSearchValue = (value: string) => {
    setSearchValue(value);
  };

  const value = {
    searchValue,
    handleSetSearchValue,
  };
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchContext;
