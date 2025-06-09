export interface Item {
  title: string;
  count?: number;
  expireDate?: string;
  location?: string;
  color?: string;
}

export interface ItemFormValues extends Item { }
