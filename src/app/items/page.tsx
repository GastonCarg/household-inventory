"use client";

import SearchContext from "@/(contexts)/searchContext/page";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AlertCircle,
  ListFilter,
  Loader2,
  Refrigerator,
  Snowflake,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useContext, useState } from "react";

import { deleteItem, getAllItems } from "@/api/items";
import { GenericCard, GenericTabs, Loader } from "@/components";
import { useItems } from "@/hooks/useItems";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { Item } from "./type";

const ItemsList: React.FC = () => {
  const t = useTranslations("ItemsList");
  const [buttonPressed, setButtonPressed] = useState(t("AllItems"));
  const { searchValue } = useContext(SearchContext);
  const { totalItems, isLoadingTotalItems, errorTotalItems } = useItems();
  const { total, expired, expiringSoon } = totalItems;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: (_data, id) => {
      queryClient.setQueryData(["items", "infinite"], (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          data: page.data.filter((item: Item) => item.id !== id),
        })),
      }));

      queryClient.invalidateQueries({ queryKey: ["items", "infinite"] });

      toast.success(t("ItemDeletedSuccessfully"));
    },
    onError: (error) => {
      toast.error(t("ErrorDeletingItem"));
      console.error(t("ErrorDeletingItemLog"), error);
    },
  });

  const buttonList = [
    {
      title: t("AllItems"),
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

  if (buttonPressed !== t("AllItems")) {
    items = items.filter((item: Item) => item.location === buttonPressed);
  }

  if (status === "pending" || isLoadingTotalItems) {
    return <Loader />;
  }

  if (error || errorTotalItems) {
    toast.error(t("ErrorFetchingItemsDetails"));
  }

  const removeItem = (id: string) => {
    mutation.mutate(id);
  };

  return (
    <>
      {total > 0 ? (
        <div className="grid grid-cols-3 gap-4 p-4">
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
          <div className="grid grid-cols-3 gap-4 p-4">
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
