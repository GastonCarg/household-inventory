import { Item } from "@/app/items/type";
import { ITEMS_URL } from "../../(constants)";

export const getAllItems = async ({
  page,
  searchValue,
}: {
  page?: number | undefined;
  searchValue?: string | undefined;
}): Promise<Item[]> => {
  try {
    // delay to simulate network latency
    await delay();

    const queryParams = new URLSearchParams();
    if (page) queryParams.append("_page", page.toString());
    if (searchValue) queryParams.append("q", searchValue);

    let url = "";
    if (process.env.NODE_ENV === "development") {
      url = `${ITEMS_URL}?${queryParams.toString()}`;
    } else {
      url = ITEMS_URL;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch items");
    }

    const data = await response.json();

    if (searchValue) {
      const filtered = data.filter((item: Item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
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
    // delay to simulate network latency
    await delay();

    const response = await fetch(ITEMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Failed to add item");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

const delay = (ms = 3000) => new Promise((res) => setTimeout(res, ms));
