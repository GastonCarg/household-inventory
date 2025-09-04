"use client";

import SearchContext from "@/(contexts)/searchContext/page";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useContext, useEffect, useState } from "react";

import { GenericCard, GenericTabs, Loader } from "@/components";
import { useDeleteItem, useGetItems, useItemsSummary } from "@/hooks/useItems";
import { useGetLocations } from "@/hooks/useLocations";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { ILocations } from "./(addItem)/type";
import { Item } from "./type";

const ItemsList: React.FC = () => {
  const t = useTranslations("ItemsList");
  const [buttonPressed, setButtonPressed] = useState(t("AllItems"));
  const { searchValue } = useContext(SearchContext);

  const { data, error, fetchNextPage, status, hasNextPage } =
    useGetItems(searchValue);
  const { data: dataSummary, status: statusSummary } = useItemsSummary();
  const total = dataSummary?.total ?? 0;
  const expired = dataSummary?.expired ?? 0;
  const expiringSoon = dataSummary?.expiringSoon ?? 0;

  const {
    data: locations,
    error: errorLocations,
    status: statusLocations,
  } = useGetLocations();
  const mutation = useDeleteItem();

  useEffect(() => {
    if (error || errorLocations) {
      toast.error(t("ErrorFetchingItemsDetails"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, errorLocations]);

  const removeItem = (id: string) => {
    mutation.mutate(id);
  };

  let buttonList = [
    {
      id: 0,
      title: t("AllItems"),
      action: (value: string) => setButtonPressed(value),
    },
  ];

  let items = data?.pages.flatMap(({ data }) => data) || [];

  if (searchValue) {
    items = items.filter((item: Item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  if (buttonPressed !== t("AllItems")) {
    items = items.filter((item: Item) => item.location === buttonPressed);
  }

  if (
    status === "pending" ||
    statusSummary === "pending" ||
    statusLocations === "pending"
  ) {
    return <Loader />;
  }

  if (locations) {
    buttonList = [
      ...buttonList,
      ...locations.map((location: ILocations) => ({
        id: location.id,
        title: location.name,
        action: (value: string) => setButtonPressed(value),
      })),
    ];
  }

  return (
    <>
      {total > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <GenericCard title={t("TotalItems")} count={total.toString()} />
          <GenericCard
            title={t("ExpiringSoon")}
            count={expiringSoon.toString()}
          />
          <GenericCard title={t("Expired")} count={expired.toString()} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 p-8">
          <AlertCircle size={36} className="text-red-500" />
          <div className="text-lg font-medium text-gray-700 text-center">
            {t("ErrorLoadingData")}
          </div>
        </div>
      )}
      <section className="flex flex-col gap-4 w-full border-b border-gray-300 pt-8">
        <div className="flex overflow-x-auto scrollbar-hide pb-2 gap-1">
          {buttonList.map((button, idx) => {
            const { title, action } = button;
            return (
              <GenericTabs
                key={idx}
                title={title}
                action={(id) => action(id)}
                buttonPressed={buttonPressed}
              ></GenericTabs>
            );
          })}
        </div>
        {/* <button
          id="Filter"
          className="flex items-center justify-center min-w-30 p-4 ml-auto text-gray-500 active:bg-gray-300"
          onClick={() => alert("Filter clicked")}
        >
          <Filter className="mr-2" />
          <span>{t("Filter")}</span>
        </button> */}
      </section>
      {mutation.isPending ? (
        <div className="flex flex-col items-center justify-center text-lg font-medium p-8 gap-2">
          <Loader2 className="animate-spin text-green-700" size={32} />
          {t("DeletingItem")}
        </div>
      ) : items.length > 0 ? (
        <InfiniteScroll
          key={searchValue}
          dataLength={items.length}
          next={fetchNextPage}
          hasMore={hasNextPage || false}
          scrollThreshold={0.9}
          loader={<Loader hasMoreItems />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {items.map((item, index) => {
              const { title, expireDate, quantity, location, id } = item;
              return (
                <GenericCard
                  key={index}
                  title={title}
                  expireDate={expireDate}
                  quantity={quantity}
                  location={location}
                  isDeletable={true}
                  id={id}
                  onDelete={() => removeItem(id)}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="flex items-center justify-center text-2xl font-bold p-8">
          {t("NoItemsFound")}
        </div>
      )}
    </>
  );
};

export default ItemsList;
