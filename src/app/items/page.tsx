"use client";

import SearchContext from "@/(contexts)/searchContext/page";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Filter, ListFilter, Refrigerator, Snowflake } from "lucide-react";
import React, { useContext, useState } from "react";

import { getAllItems } from "@/api/items";
import { GenericCard, GenericTabs } from "@/components";
import InfiniteScroll from "react-infinite-scroll-component";

const ItemsList: React.FC = () => {
  const [buttonPressed, setButtonPressed] = useState("All Items");
  const { searchValue } = useContext(SearchContext);

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

  const { data, error, fetchNextPage, status, hasNextPage } =
    useInfiniteQuery<any>({
      queryKey: ["items", "infinite"],
      queryFn: ({ pageParam = 1 }) =>
        getAllItems({
          page: Number(pageParam),
          searchValue: searchValue || "",
        }),
      initialPageParam: 1,
      getNextPageParam: (nextPage) => nextPage.next ?? undefined,
    });

  let items = data?.pages.flatMap(({ data }) => data) || [];
  const total = data?.pages.flatMap(({ items }) => items)[0] || 0;

  if (searchValue) {
    items = items.filter((item: any) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }
  if (buttonPressed !== "All Items") {
    items = items.filter((item: any) => item.category === buttonPressed);
  }

  // TODO: implement loading component
  if (status === "pending") {
    return <div>Loading...</div>;
  }

  // TODO: implement error component
  if (error) {
    console.error("Error fetching items:", error);
    return <div>Error</div>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4">
        <GenericCard title="Total items" count="20" color="black" />
        <GenericCard title="Expiring soon" count="6" color="orange" />
        <GenericCard title="Expired" count="3" color="red" />
      </div>
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
      <InfiniteScroll
        key={searchValue}
        dataLength={items.length}
        next={fetchNextPage}
        hasMore={hasNextPage || false}
        scrollThreshold={0.9}
        loader={<h4>Loading more items...</h4>}
      >
        <div className="grid grid-cols-3 gap-4 p-4">
          {items.map((item, index) => {
            const { title, color, expireDate } = item;
            return (
              <GenericCard
                key={index}
                title={title}
                color={color}
                expireDate={expireDate}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default ItemsList;
