import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import Header from "./header";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: jest.fn(),
  }),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
  QueryClient: jest.requireActual("@tanstack/react-query").QueryClient,
  QueryClientProvider: jest.requireActual("@tanstack/react-query")
    .QueryClientProvider,
}));

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

test("the user can open the add item modal", () => {
  renderWithQueryClient(<Header />);

  const addItemButton = screen.getByRole("button", { name: "AddItem" });
  expect(addItemButton).toBeInTheDocument();

  fireEvent.mouseUp(addItemButton);

  expect(screen.getByText("ProductName:")).toBeInTheDocument();
  expect(screen.getByText("Expiration:")).toBeInTheDocument();
  expect(screen.getByText("Location:")).toBeInTheDocument();

  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
});

test("the user can close the add item modal", () => {
  renderWithQueryClient(<Header />);

  const addItemButton = screen.getByRole("button", { name: "AddItem" });
  expect(addItemButton).toBeInTheDocument();

  fireEvent.mouseUp(addItemButton);

  const cancelButton = screen.getByRole("button", { name: "Cancel" });
  expect(cancelButton).toBeInTheDocument();

  fireEvent.click(cancelButton);

  expect(screen.queryByText("ProductName:")).not.toBeInTheDocument();
  expect(screen.queryByText("Expiration:")).not.toBeInTheDocument();
  expect(screen.queryByText("Location:")).not.toBeInTheDocument();
});

test("the user can search an item", () => {
  renderWithQueryClient(<Header />);

  const searchButton = screen.getByRole("button", { name: "Search" });
  expect(searchButton).toBeInTheDocument();

  fireEvent.click(searchButton);

  expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  expect(screen.getByRole("searchbox")).toBeInTheDocument();

  const searchInput = screen.getByRole("searchbox");
  expect(searchInput).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: "Manzana" } });
  expect(searchInput).toHaveValue("Manzana");
});
