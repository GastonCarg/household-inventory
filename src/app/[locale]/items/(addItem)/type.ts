import { Item } from '../type';

export interface IAddItemModal {
  closeModal: () => void;
  addItemModal?: boolean;
  editingItem?: Item | null;
}

export interface ILocations {
  id: string | number;
  name: string;
  deletedAt?: string | null;
}
