'use client';

import { ItemModalContext } from '@/(contexts)';
import Loader from '@/components/Loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense, useContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Header from '../(header)/header';

const ItemsList = lazy(() => import('./items/page'));
const ItemModal = lazy(() => import('./items/(addItem)/addItem'));

const Home = () => {
  const [queryClient] = useState(() => new QueryClient());
  const { addItemModal, closeModal, editingItem } =
    useContext(ItemModalContext);

  return (
    <QueryClientProvider client={queryClient}>
      <div inert={addItemModal || undefined}>
        <Header />
        <div className="mx-auto grid w-full max-w-7xl gap-6 p-5 sm:p-6">
          <Suspense fallback={<Loader />}>
            <ItemsList />
          </Suspense>
        </div>
      </div>
      {addItemModal && (
        <Suspense>
          <ItemModal closeModal={closeModal} editingItem={editingItem} />
        </Suspense>
      )}
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default Home;
