import { ITEMS_URL } from "../../(constants)";

// TODO: add typing
export const getAllItems = async ({
  page,
  searchValue,
}: {
  page?: number | undefined;
  searchValue?: string | undefined;
}): Promise<any> => {
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
      // TODO: add typing
      const filtered = data.filter((item: any) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );

      return filtered;
    }
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

const delay = (ms = 3000) => new Promise((res) => setTimeout(res, ms));
