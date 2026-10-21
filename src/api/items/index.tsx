import {
  Item,
  ItemsResponse,
  ItemSummaryResponse,
} from '@/app/[locale]/items/type';

// json-server (dev) and the Nest API use different pagination params
const PAGINATION_PARAMS =
  process.env.NODE_ENV === 'development'
    ? { page: '_page', limit: '_per_page' }
    : { page: 'page', limit: 'limit' };
// The Nest API already sorts by expireDate; json-server only sorts when asked
const SORT_PARAMS: Record<string, string> =
  process.env.NODE_ENV === 'development' ? { _sort: 'expireDate' } : {};

export const getAllItems = async ({
  page = 1,
  searchValue,
}: {
  page?: number | undefined;
  searchValue?: string | undefined;
}): Promise<ItemsResponse> => {
  try {
    const limit = 12;
    const queryParams = new URLSearchParams();
    queryParams.append(PAGINATION_PARAMS.page, page.toString());
    queryParams.append(PAGINATION_PARAMS.limit, limit.toString());
    Object.entries(SORT_PARAMS).forEach(([key, value]) =>
      queryParams.append(key, value)
    );
    if (searchValue) queryParams.append('q', searchValue);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/products?${queryParams.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch all items');
    }

    const data: ItemsResponse = await response.json();
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add item');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const addItemsBulk = async (items: Item[]): Promise<Item[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/bulk`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add items');
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
    //   `${process.env.NEXT_PUBLIC_API_URL}/products/summary`
    // );

    if (!response.ok) {
      throw new Error('Failed to fetch item summary');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteItem = async (id: number | string): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch item summary');
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
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
