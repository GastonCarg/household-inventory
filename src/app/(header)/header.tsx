'use client';

import { Plus } from "lucide-react";

import SearchComponent from "../(search)/searchComponent";

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-300 bg-white">
      <label className="p-4 text-2xl font-bold">Food Inventory</label>
      <div className="grid grid-flow-col gap-4 p-4">
        <SearchComponent />
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
