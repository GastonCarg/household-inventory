export interface Item {
  id?: number | string;
  title: string;
  count?: number;
  expireDate?: string;
  location?: ILocations;
  color?: string;
  quantity: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  total: number;
  next: number | null;
}

export interface IDefaultCards {
  id: number;
  title: string;
  status: string;
  icon?: string;
  value: number;
}

export interface ILocations {
  id: string | number;
  name: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemsListComponentProps {
  item: Item;
  removeItem: (id: number | string) => void;
  editItem: (item: Item) => void;
}
