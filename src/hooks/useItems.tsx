import { addItem, deleteItem, getAllItems, getItemsSummary } from "@/api/items";
import { Item } from "@/app/[locale]/items/type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export const useItemsSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: getItemsSummary,
    placeholderData: { total: 0, expired: 0, expiringSoon: 0 },
  });
};

export const useGetItems = (searchValue: string) => {
  return useInfiniteQuery<any>({
    queryKey: ["items", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      getAllItems({
        page: Number(pageParam),
        searchValue: searchValue || "",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.page);
      return currentPage < lastPage.lastPage ? currentPage + 1 : undefined;
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("ItemsList");
  return useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["summary"] });

      toast.success(t("ItemDeletedSuccessfully"));
    },
    onError: (error) => {
      toast.error(t("ErrorDeletingItem"));
      console.error(t("ErrorDeletingItemLog"), error);
    },
  });
};

export const useAddItem = (closeModal: Function) => {
  const queryClient = useQueryClient();
  const t = useTranslations("AddItemModal");
  return useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", "infinite"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success(t("ItemAddedSuccessfully"), {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      closeModal();
    },
    onError: (error) => {
      toast.error(t("ErrorAddingItem"));
      console.error(t("ErrorAddingItemLog"), error);
    },
  });
};
