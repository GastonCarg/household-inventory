'use client';

import { ItemModalContext } from '@/(contexts)';
import Loader from '@/components/Loader';
import { useGetLocations } from '@/hooks/useLocations';
import { useRouter } from '@/i18n/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Header from '../(header)/header';

const ItemsList = lazy(() => import('./items/page'));
const ItemModal = lazy(() => import('./items/(addItem)/addItem'));
const ScanSession = lazy(() => import('./items/(scan)/ScanSession'));

const HomeContent = ({ isModalOpen }: { isModalOpen: boolean }) => {
  const router = useRouter();
  const { data: locations, status } = useGetLocations();

  useEffect(() => {
    if (status === 'success' && locations.length === 0) {
      router.replace('/locations');
    }
  }, [locations, router, status]);

  if (
    status === 'pending' ||
    (status === 'success' && locations.length === 0)
  ) {
    return <Loader />;
  }

  return (
    <div inert={isModalOpen || undefined}>
      <Header />
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-5 sm:p-6">
        <Suspense fallback={<Loader />}>
          <ItemsList />
        </Suspense>
      </div>
    </div>
  );
};

const Home = () => {
  const [queryClient] = useState(() => new QueryClient());
  const { addItemModal, closeModal, editingItem, scanSession, closeScan } =
    useContext(ItemModalContext);

  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent isModalOpen={addItemModal || scanSession} />
      {addItemModal && (
        <Suspense>
          <ItemModal closeModal={closeModal} editingItem={editingItem} />
        </Suspense>
      )}
      {scanSession && (
        <Suspense>
          <ScanSession closeScan={closeScan} />
        </Suspense>
      )}
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default Home;
