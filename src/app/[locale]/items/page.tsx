"use client";
import React, { useContext, useEffect, useState } from "react";

import { Filter, Loader2, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

import {
  CARD_LEFT_BORDER,
  STATUS_COLOR_MAP,
  STATUS_ICON_MAP,
  SUMMARY_CARD_FILTER_MAP,
} from "@/(constants)";
import { ItemModalContext, SearchContext } from "@/(contexts)";
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
  const { editItem } = useContext(ItemModalContext);

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

  let items: Item[] = data?.pages.flatMap(({ data }) => data) || [];

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
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUMMARY_CARDS.map((card) => {
          const { id, title, status, value } = card;
          return (
            <Card
              key={id}
              props={`cursor-pointer ${CARD_LEFT_BORDER[status] ?? ""}`}
              onClick={() => {
                const mapped = SUMMARY_CARD_FILTER_MAP[status] ?? "all";
                handleSetStatusFilter({
                  status: statusFilter.status === mapped ? "all" : mapped,
                });
              }}
            >
              <Card.Header props="justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h2
                    aria-label="title"
                    className="text-sm font-semibold text-[#8A90AB] uppercase tracking-wider"
                  >
                    {t(title)}
                  </h2>
                  <p
                    className={`font-bold text-3xl sm:text-4xl ${STATUS_COLOR_MAP[status].text}`}
                    aria-label={`${t(title)}: ${value}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {value}
                  </p>
                </div>
                <div
                  className={`flex items-center justify-center rounded-xl w-11 h-11 ${STATUS_COLOR_MAP[status].bg}`}
                >
                  <IconSummaryItem status={status} />
                </div>
              </Card.Header>
              <Card.Content>
                <div
                  className="w-full bg-[#1E2130] rounded-full h-1.5 mt-3"
                  aria-hidden="true"
                >
                  <div
                    className={`${STATUS_COLOR_MAP[status]?.bgSummary ?? "bg-blue-500"} h-1.5 rounded-full`}
                    style={{
                      width: `${total > 0 ? Math.min((value / total) * 100, 100) : 0}%`,
                      transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
      <nav
        aria-label={t("FilterByLocation")}
        className="flex flex-col gap-4 w-full border-b border-[#1E2130] px-2"
      >
        <div
          role="tablist"
          aria-label={t("FilterByLocation")}
          className="flex overflow-x-auto scrollbar-hide pb-2 gap-1 items-center"
        >
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
            className="flex items-center justify-center min-w-30 p-3 ml-auto text-[#8A90AB] hover:text-[#F2F4FF] transition-colors group"
          >
            <Filter
              className="mr-2 group-hover:text-[#deff6ecc]"
              size={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 20
                  : 18
              }
            />
            <select
              value={statusFilter.status}
              className="bg-transparent focus:outline-none cursor-pointer text-sm group-hover:text-[#deff6ecc] px-1 font-medium text-[#8A90AB]"
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
      </nav>
      {mutation.isPending ? (
        <div className="flex flex-col items-center justify-center text-lg font-medium p-8 gap-3 text-[#8A90AB]">
          <Loader2 className="animate-spin text-[#deff6ecc]" size={32} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ItemsListComponent
                  item={item}
                  removeItem={removeItem}
                  editItem={editItem}
                />
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 gap-4 text-center">
          <div className="w-16 h-16 bg-[#1C1F2E] rounded-2xl flex items-center justify-center">
            <Package size={32} className="text-[#404460]" />
          </div>
          <p className="text-lg font-semibold text-[#8A90AB]">
            {t("NoItemsFound")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
