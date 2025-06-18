export interface Item {
  title: string;
  count?: number;
  expireDate?: string;
  location?: string;
  color?: string;
}

export interface ItemFormValues extends Item { }

export interface ItemSummaryResponse {
  total: number;
  expired: number;
  expiringSoon: number;
}
