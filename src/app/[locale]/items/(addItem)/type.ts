export interface IAddItemModal {
  closeModal: () => void;
  addItemModal?: boolean;
}

export interface ILocations {
  id: number;
  name: string;
  deletedAt: string;
}
