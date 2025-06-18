import { useEffect, useState } from "react";

import { getItemsSummary } from "@/api/items";
import { ItemSummaryResponse } from "@/app/items/type";

export const useItems = () => {
  const [totalItems, setTotalItems] = useState<ItemSummaryResponse>({
    total: 0,
    expired: 0,
    expiringSoon: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchItemsSummary = async () => {
    setIsLoading(true);
    try {
      const summary = await getItemsSummary();
      setTotalItems(summary);
    } catch (error) {
      setError("Failed to fetch items summary");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItemsSummary();
  }, []);

  return {
    totalItems,
    isLoadingTotalItems: isLoading,
    errorTotalItems: error,
  };
};
