'use client';

import { Item } from '@/app/[locale]/items/type';
import React, { createContext, useCallback, useState } from 'react';

interface IItemModalContext {
  addItemModal: boolean;
  editingItem: Item | null;
  openModal: () => void;
  closeModal: () => void;
  editItem: (item: Item) => void;
  scanSession: boolean;
  openScan: () => void;
  closeScan: () => void;
}

const ItemModalContext = createContext<IItemModalContext>({
  addItemModal: false,
  editingItem: null,
  openModal: () => {},
  closeModal: () => {},
  editItem: () => {},
  scanSession: false,
  openScan: () => {},
  closeScan: () => {},
});

export const ItemModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [addItemModal, setAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [scanSession, setScanSession] = useState(false);

  // Stable references: the modals use these as effect dependencies
  const openModal = useCallback(() => {
    setAddItemModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setAddItemModal(false);
    setEditingItem(null);
  }, []);

  const editItem = useCallback((item: Item) => {
    setEditingItem(item);
    setAddItemModal(true);
  }, []);

  const openScan = useCallback(() => {
    setScanSession(true);
  }, []);

  const closeScan = useCallback(() => {
    setScanSession(false);
  }, []);

  const value = {
    addItemModal,
    editingItem,
    openModal,
    closeModal,
    editItem,
    scanSession,
    openScan,
    closeScan,
  };

  return (
    <ItemModalContext.Provider value={value}>
      {children}
    </ItemModalContext.Provider>
  );
};

export default ItemModalContext;
