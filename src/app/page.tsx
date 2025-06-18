"use client";

import Header from "./(header)/header";
import ItemsList from "./items/page";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const [queryClient] = useState(() => {
    return new QueryClient();
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className="grid gap-4 p-4">
        <ItemsList />
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default Home;
