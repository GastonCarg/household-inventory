"use client";

import { Plus, Search } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import SearchContext from "../../(contexts)/searchContext/page";

const Header = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const { handleSetSearchValue } = useContext(SearchContext);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  const handleClickSearch = () => {
    const element = document.getElementById("search");
    if (element) {
      element.classList.remove("hidden");
      element.classList.add("block");
    }

    const buttonElement = document.getElementById("searchButton");
    if (buttonElement) {
      buttonElement.classList.add("hidden");
    }
    focusSearch();
  };

  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  const getResults = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const search = document.getElementById("search");
      const searchButton = document.getElementById("searchButton");
      if (search) {
        search.classList.remove("block");
        search.classList.add("hidden");
      }

      if (searchButton) {
        searchButton.classList.remove("hidden");
        searchButton.classList.add("block");
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSetSearchValue(inputValue);
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-300 bg-white">
      <label className="p-4 text-2xl font-bold">Food Inventory</label>
      <div className="grid grid-flow-col gap-4 p-4">
        <button
          id="searchButton"
          onClick={handleClickSearch}
          className="rounded-md bg-gray-400 border-none p-2 text-white flex items-center hover:bg-gray-600 max-h-10"
        >
          <Search />
          <span className="text-white p-2">Search</span>
        </button>
        <input
          id="search"
          type="search"
          ref={searchInputRef}
          placeholder="Search..."
          className="rounded-md bg-gray-200 p-2 focus:ring-2 focus:ring-gray-500 focus:outline-none hidden"
          value={inputValue}
          onChange={handleInputValue}
          onKeyUp={getResults}
        />
        <button
          className="rounded-md bg-green-600 border-none p-2 text-white flex items-center gap-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onMouseUp={() => alert("Open modal")}
        >
          <Plus className="h-5 w-5 text-white" />
          <span>Add Item</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
