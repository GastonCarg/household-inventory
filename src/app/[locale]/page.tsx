"use client";

import Loader from "@/components/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { ToastContainer } from "react-toastify";
import Header from "../(header)/header";

const ItemsList = lazy(() => import("../items/page"));

const Home = () => {
  const [queryClient] = useState(() => {
    return new QueryClient();
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className="grid gap-4 p-4">
        <Suspense fallback={<Loader />}>
          <ItemsList />
        </Suspense>
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default Home;
