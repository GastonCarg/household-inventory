"use client";

import ItemsList from "./items/page";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();
const Home = () => {
  return (
    // TODO: Add i18n to translation
    <QueryClientProvider client={queryClient}>
      <div className="grid gap-4 p-4">
        <ItemsList />
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default Home;
