import { Item, ItemSummaryResponse } from "@/app/[locale]/items/type";

export const getAllItems = async ({
  page = 1,
  searchValue,
}: {
  page?: number | undefined;
  searchValue?: string | undefined;
}) => {
  try {
    const limit = 12;
    const queryParams = new URLSearchParams();
    queryParams.append("_page", page.toString());
    queryParams.append("_limit", limit.toString());
    if (searchValue) queryParams.append("q", searchValue);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch all items");
    }

    const data: Item[] = await response.json();
    const total = parseInt(response.headers.get("X-Total-Count") ?? "0", 10);
    const lastPage = Math.ceil(total / limit);

    return { data, page, lastPage };
  } catch (error) {
    throw error;
  }
};

export const addItem = async (item: Item): Promise<Item> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to add item");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getItemsSummary = async (): Promise<ItemSummaryResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summary`);
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/products/summary`,
    // );

    if (!response.ok) {
      throw new Error("Failed to fetch item summary");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch item summary");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateItem = async (id: string, item: Item): Promise<Item> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update item");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
