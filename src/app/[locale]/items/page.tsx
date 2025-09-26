"use client";
import React, { useContext, useEffect, useState } from "react";

import { Filter, Loader2, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

import { STATUS_COLOR_MAP, STATUS_ICON_MAP } from "@/(constants)";
import SearchContext from "@/(contexts)/searchContext/page";
import { Card, GenericTabs, Loader } from "@/components";
import { useDeleteItem, useGetItems, useItemsSummary } from "@/hooks/useItems";
import { useGetLocations } from "@/hooks/useLocations";
import { IFilterSearch } from "@/lib/types";
import { ILocations } from "./(addItem)/type";
import { ItemsListComponent } from "./(ItemList)/page";
import { IDefaultCards, Item } from "./type";

const ItemsList: React.FC = () => {
  const t = useTranslations("ItemsList");
  const [buttonPressed, setButtonPressed] = useState(t("AllItems"));
  const { searchValue, statusFilter, filterByStatus, handleSetStatusFilter } =
    useContext(SearchContext);

  const { data, error, fetchNextPage, status, hasNextPage } =
    useGetItems(searchValue);

  const { data: dataSummary, status: statusSummary } = useItemsSummary();
  const total = dataSummary?.total ?? 0;
  const expired = dataSummary?.expired ?? 0;
  const expiringSoon = dataSummary?.expiringSoon ?? 0;

  const SUMMARY_CARDS: IDefaultCards[] = [
    { id: 1, title: "TotalItems", status: "default", value: total },
    {
      id: 2,
      title: "ExpiringSoon",
      status: "warning",
      value: expiringSoon,
    },
    {
      id: 3,
      title: "Expired",
      status: "error",
      value: expired,
    },
  ];
  let buttonList = [
    {
      id: 0,
      title: t("AllItems"),
      action: (value: string) => setButtonPressed(value),
    },
  ];

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

  let items = data?.pages.flatMap(({ data }) => data) || [];

  if (searchValue) {
    items = items.filter((item: Item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  if (statusFilter && statusFilter.status !== "all") {
    items = items.filter(
      (item: Item) =>
        filterByStatus(item.expireDate ?? "").status === statusFilter.status,
    );
  }

  if (buttonPressed !== t("AllItems")) {
    items = items.filter((item: Item) => item.location?.name === buttonPressed);
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

  function IconSummaryItem({ status }: { status: string }) {
    const Icon = STATUS_ICON_MAP[status] ?? Package;

    return (
      <Icon
        className={`${STATUS_COLOR_MAP[status].text ?? "text-gray-500"}`}
        size={24}
      />
    );
  }

  return (
    <div className="grid grid-cols-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUMMARY_CARDS.map((card) => {
          const { id, title, status, value } = card;
          return (
            <Card key={id} props="cursor-pointer">
              <Card.Header props="justify-between">
                <h2
                  aria-label="title"
                  className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-2"
                >
                  {t(title)}
                </h2>
                <div
                  className={`flex items-center justify-center rounded-md w-10 h-10 ${STATUS_COLOR_MAP[status].bg}`}
                >
                  <IconSummaryItem status={status} />
                </div>
              </Card.Header>
              <Card.Content>
                <p
                  className={`font-bold text-2xl sm:text-3xl mb-2 ${STATUS_COLOR_MAP[status].text}`}
                  aria-label={`${t(title)}: ${value}`}
                >
                  {value}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${STATUS_COLOR_MAP[status]?.bgSummary ?? "bg-blue-500"} h-2.5 rounded-full`}
                    style={{
                      width: `${total > 0 ? Math.min((value / total) * 100, 100) : 0}%`,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
      <section className="flex flex-col gap-4 w-full border-b border-gray-300 pt-8 px-4">
        <div className="flex overflow-x-auto scrollbar-hide pb-2 gap-1 items-center">
          {buttonList.map((button) => {
            const { id, title, action } = button;
            return (
              <GenericTabs
                key={id}
                title={title}
                action={(title) => action(title)}
                buttonPressed={buttonPressed}
              />
            );
          })}
          <div
            id="Filter"
            className="flex items-center justify-center min-w-30 p-4 ml-auto text-gray-500 active:bg-gray-300 group"
          >
            <Filter
              className="mr-2 group-hover:text-blue-500 group-active:text-blue-500"
              size={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 20
                  : 24
              }
            />
            <select
              defaultValue="all"
              className="bg-transparent focus:outline-none cursor-pointer text-sm group-hover:text-blue-500 group-active:text-blue-500 px-1"
              aria-label="Filter items by status"
              onChange={(e) => {
                const value = e.target.value as IFilterSearch["status"];
                handleSetStatusFilter({ status: value });
              }}
            >
              <option value="all">{t("AllItems")}</option>
              <option value="ok">{t("Ok")}</option>
              <option value="expiringSoon">{t("ExpiringSoon")}</option>
              <option value="expired">{t("Expired")}</option>
            </select>
          </div>
        </div>
      </section>
      {mutation.isPending ? (
        <div className="flex flex-col items-center justify-center text-lg font-medium p-8 gap-2">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p>{t("DeletingItem")}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ItemsListComponent item={item} removeItem={removeItem} />
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="flex items-center justify-center text-2xl font-bold p-8">
          {t("NoItemsFound")}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
