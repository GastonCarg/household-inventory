"use client";

import GenericCard from "@/components/GenericCard";
import GenericTabs from "@/components/GenericTabs";
import { Filter, ListFilter, Refrigerator, Snowflake } from "lucide-react";
import React, { useState } from "react";

const ItemsList: React.FC = () => {
  const [buttonPressed, setButtonPressed] = useState("Refrigerator");

  const buttonList = [
    {
      title: "All Items",
      action: (value: string) => setButtonPressed(value),
      icon: <ListFilter className="mr-2" />,
    },
    {
      title: "Refrigerator",
      action: (value: string) => setButtonPressed(value),
      icon: <Refrigerator className="mr-2" />,
    },
    {
      title: "Freezer",
      action: (value: string) => setButtonPressed(value),
      icon: <Snowflake className="mr-2" />,
    },
  ];

  return (
    <>
      <section className="flex column gap-4 w-full border-b border-gray-300 pt-8">
        {buttonList.map((button, idx) => {
          const { title, action, icon } = button;
          return (
            <GenericTabs
              key={idx}
              title={title}
              action={() => action(title)}
              buttonPressed={buttonPressed}
            >
              {icon}
            </GenericTabs>
          );
        })}
        <button
          id="Filter"
          className="flex items-center justify-center min-w-30 p-4 ml-auto text-gray-500 active:bg-gray-300"
          onClick={() => alert("Filter clicked")}
        >
          <Filter className="mr-2" />
          <span>Filter</span>
        </button>
      </section>
      <div className="grid grid-cols-3 gap-4 p-4">
        <GenericCard title="Pollo" color="orange" expireDate="May 8, 2025" />
        <GenericCard title="Milanesas de carne" color="orange" expireDate="May 9, 2025" />
      </div>
    </>
  );
};

export default ItemsList;
