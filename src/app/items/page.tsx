"use client";

import { Refrigerator, Snowflake } from "lucide-react";
import React from "react";

const buttonList = [
  {
    title: "Refrigerator",
    action: console.log("Refrigerator items"),
  },
  {
    title: "Freezer",
    action: console.log("Freezer items"),
  },
];

const ItemsList: React.FC = () => {
  return (
    <>
      <section className="flex column gap-4 w-full border-b border-gray-300 pt-8">
        <button
          id="Refrigerator"
          className="flex column min-w-30 border-b-2 border-green-500 p-4 hover:bg-green-300"
        >
          <Refrigerator className="mr-2" />
          <span>Heladera</span>
        </button>
        <button
          id="Freezer"
          className="flex column min-w-30 border-b-2 border-green-500 p-4"
        >
          <Snowflake className="mr-2" />
          <span>Freezer</span>
        </button>
      </section>
      <div></div>
    </>
  );
};

export default ItemsList;
