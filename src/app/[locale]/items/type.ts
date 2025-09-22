export interface Item {
  id?: string;
  title: string;
  count?: number;
  expireDate?: string;
  location?: ILocations;
  color?: string;
  quantity: number;
}

export interface IAddItem {
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

export interface IDefaultCards {
  id: number;
  title: string;
  status: string;
  icon?: string;
  value: number;
}

export interface ILocations {
  id: number;
  name: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
}

export interface ItemsListComponentProps {
  item: Item;
  removeItem: (id: string) => void;
}
