"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useRef, useState } from "react";

import { SearchContext } from "@/(contexts)";

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
    <div role="search" className="flex items-center gap-2 w-full sm:w-auto">
      {!isInputVisible && inputValue === "" && (
        <button
          onClick={handleClickSearch}
          aria-label={t("Search")}
          aria-expanded={false}
          type="button"
          className="rounded-xl border border-divider bg-surface-elevated px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-divider hover:border-primary/40 max-h-10 w-full sm:w-auto transition-all duration-150 text-fg-muted hover:text-fg"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">{t("Search")}</span>
        </button>
      )}

      {(isInputVisible || inputValue !== "") && (
        <input
          type="search"
          ref={searchInputRef}
          aria-label={t("Search")}
          placeholder={`${t("Search")}...`}
          className="rounded-xl bg-surface-elevated border border-divider px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all w-full max-h-10 text-base sm:w-auto text-fg placeholder:text-fg-dim"
          value={inputValue}
          onChange={handleInputValue}
          onKeyUp={getResults}
          onBlur={() => {
            if (inputValue === "") setIsInputVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchComponent;
