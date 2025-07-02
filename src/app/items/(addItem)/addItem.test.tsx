import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddItemModal from "./addItem";

const mockCloseModal = jest.fn();
const mockMutate = jest.fn();

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
    mutate: mockMutate,
  }),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
  QueryClient: jest.requireActual("@tanstack/react-query").QueryClient,
  QueryClientProvider: jest.requireActual("@tanstack/react-query")
    .QueryClientProvider,
}));

jest.mock("@/api/items", () => ({
  addItem: jest.fn(),
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

test("the user can fill the add item modal", () => {
  renderWithQueryClient(<AddItemModal closeModal={mockCloseModal} />);

  expect(screen.getByText("AddItem")).toBeInTheDocument();

  const productNameInput = screen.getByPlaceholderText("ProductName");
  expect(productNameInput).toBeInTheDocument();

  const expirationInput = screen.getByPlaceholderText("30");
  expect(expirationInput).toBeInTheDocument();

  const locationSelect = screen.getByRole("combobox");
  expect(locationSelect).toBeInTheDocument();

  const submitButton = screen.getByRole("button", { name: "Submit" });
  expect(submitButton).toBeInTheDocument();

  const cancelButton = screen.getByRole("button", { name: "Cancel" });
  expect(cancelButton).toBeInTheDocument();

  fireEvent.change(productNameInput, { target: { value: "Manzana" } });
  fireEvent.change(expirationInput, { target: { value: "3" } });
  fireEvent.change(locationSelect, { target: { value: "Refrigerator" } });

  expect(productNameInput).toHaveValue("Manzana");
  expect(expirationInput).toHaveValue(3);
  expect(locationSelect).toHaveValue("Refrigerator");
});

test("the user can add a new item", async () => {
  renderWithQueryClient(<AddItemModal closeModal={mockCloseModal} />);

  const productNameInput = screen.getByPlaceholderText("ProductName");
  const expirationInput = screen.getByPlaceholderText("30");
  const locationSelect = screen.getByRole("combobox");

  fireEvent.change(productNameInput, { target: { value: "Manzana" } });
  fireEvent.change(expirationInput, { target: { value: "3" } });
  fireEvent.change(locationSelect, { target: { value: "Refrigerator" } });

  const form = screen.getByTestId("addItemForm");
  expect(form).toBeInTheDocument();

  fireEvent.submit(form);

  await waitFor(() => {
    expect(mockMutate).toHaveBeenCalledWith({
      title: "Manzana",
      expireDate: expect.any(String),
      location: "Refrigerator",
    });
  });
});

test("the user can close the add item modal", () => {
  renderWithQueryClient(<AddItemModal closeModal={mockCloseModal} />);

  const cancelButton = screen.getByRole("button", { name: "Cancel" });
  expect(cancelButton).toBeInTheDocument();

  fireEvent.click(cancelButton);

  expect(mockCloseModal).toHaveBeenCalled();
});
