"use client";

import { Item } from "@/app/[locale]/items/type";
import React, { createContext, useState } from "react";

interface IItemModalContext {
  addItemModal: boolean;
  editingItem: Item | null;
  openModal: () => void;
  closeModal: () => void;
  editItem: (item: Item) => void;
}

const ItemModalContext = createContext<IItemModalContext>({
  addItemModal: false,
  editingItem: null,
  openModal: () => {},
  closeModal: () => {},
  editItem: () => {},
});

export const ItemModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [addItemModal, setAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const openModal = () => {
    setAddItemModal(true);
  };

  const closeModal = () => {
    setAddItemModal(false);
    setEditingItem(null);
  };

  const editItem = (item: Item) => {
    setEditingItem(item);
    setAddItemModal(true);
  };

  const value = {
    addItemModal,
    editingItem,
    openModal,
    closeModal,
    editItem,
  };

  return (
    <ItemModalContext.Provider value={value}>
      {children}
    </ItemModalContext.Provider>
  );
};

export default ItemModalContext;
