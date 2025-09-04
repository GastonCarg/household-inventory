"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";

import SearchContext from "../../(contexts)/searchContext/page";

const SearchComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const { handleSetSearchValue } = useContext(SearchContext);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Search");

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClickSearch = () => {
    setIsInputVisible(true);
    setTimeout(() => searchInputRef.current?.focus(), 300);
  };

  const getResults = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsInputVisible(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSetSearchValue(inputValue);
    }, 600);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {!isInputVisible && (
        <button
          onClick={handleClickSearch}
          className="rounded-md bg-gray-400 border-none p-3 text-white flex items-center justify-center gap-2 hover:bg-gray-600 max-h-10 w-full sm:w-auto sm:min-w-0 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="text-white text-sm sm:text-base">{t("Search")}</span>
        </button>
      )}

      {isInputVisible && (
        <input
          type="search"
          ref={searchInputRef}
          placeholder={`${t("Search")}...`}
          className="rounded-md bg-gray-200 p-3 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all w-full max-h-10 text-base"
          value={inputValue}
          onChange={handleInputValue}
          onKeyUp={getResults}
        />
      )}
    </div>
  );
};

export default SearchComponent;
