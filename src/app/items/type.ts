export interface Item {
  id?: string;
  title: string;
  count?: number;
  expireDate?: string;
  location?: string;
  color?: string;
  quantity: number;
}

export interface ItemFormValues extends Item { }

export interface ItemSummaryResponse {
  total: number;
  expired: number;
  expiringSoon: number;
}
