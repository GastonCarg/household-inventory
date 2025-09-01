import { Item, ItemSummaryResponse } from "@/app/[locale]/items/type";

export const getAllItems = async ({
  page,
  searchValue,
}: {
  page?: number | undefined;
  searchValue?: string | undefined;
}): Promise<Item[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page.toString());
    if (searchValue) queryParams.append("q", searchValue);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    if (searchValue) {
      const filtered = data.filter((item: Item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase()),
      );

      return filtered;
    }
    return data;
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/summary`,
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
