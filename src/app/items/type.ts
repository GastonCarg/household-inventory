export interface Item {
  id?: string;
  title: string;
  count?: number;
  expireDate?: string;
  location?: string;
  color?: string;
  quantity: number;
}

export type ItemFormValues = Item;

export interface ItemSummaryResponse {
  total: number;
  expired: number;
  expiringSoon: number;
}

export interface ItemsResponse {
  data: Item[];
  page: number;
  lastPage: number;
}
