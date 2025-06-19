"use client";

import SearchContext from "@/(contexts)/searchContext/page";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Filter, ListFilter, Refrigerator, Snowflake } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { Suspense, useContext, useState } from "react";

import { getAllItems } from "@/api/items";
import { GenericCard, GenericTabs } from "@/components";
import { useItems } from "@/hooks/useItems";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { Item } from "./type";

const ItemsList: React.FC = () => {
  const [buttonPressed, setButtonPressed] = useState("All Items");
  const { searchValue } = useContext(SearchContext);
  const { totalItems, isLoadingTotalItems, errorTotalItems } = useItems();
  const { total, expired, expiringSoon } = totalItems;

  const t = useTranslations("ItemsList");

  // TODO: implement horizontal scroll
  const buttonList = [
    {
      title: t("All Items"),
      action: (value: string) => setButtonPressed(value),
      icon: <ListFilter className="mr-2" />,
    },
    {
      title: t("Refrigerator"),
      action: (value: string) => setButtonPressed(value),
      icon: <Refrigerator className="mr-2" />,
    },
    {
      title: t("Freezer"),
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

  if (searchValue) {
    items = items.filter((item: Item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (buttonPressed !== "All Items") {
    items = items.filter((item: Item) => item.location === buttonPressed);
  }

  // TODO: implement loading component
  if (status === "pending" || isLoadingTotalItems) {
    return <div>Loading...</div>;
  }

  // TODO: implement error component
  if (error || errorTotalItems) {
    const errorMessage = error
      ? error.message
      : errorTotalItems || "Unknown error";
    toast.error("Error fetching items: " + errorMessage);
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <GenericCard title={t("TotalItems")} count={total.toString()} />
          <GenericCard
            title={t("ExpiringSoon")}
            count={expiringSoon.toString()}
          />
          <GenericCard title={t("Expired")} count={expired.toString()} />
        </Suspense>
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
          <span>{t("Filter")}</span>
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
            const { title, expireDate } = item;
            return (
              <GenericCard key={index} title={title} expireDate={expireDate} />
            );
          })}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default ItemsList;
