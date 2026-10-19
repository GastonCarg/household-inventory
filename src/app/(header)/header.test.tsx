import { fireEvent, render, screen } from '@testing-library/react';
import { ItemModalContext } from '@/(contexts)';
import Header from './header';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const mockOpenModal = jest.fn();
const mockOpenScan = jest.fn();

const renderHeader = () =>
  render(
    <ItemModalContext.Provider
      value={{
        addItemModal: false,
        editingItem: null,
        openModal: mockOpenModal,
        closeModal: jest.fn(),
        editItem: jest.fn(),
        scanSession: false,
        openScan: mockOpenScan,
        closeScan: jest.fn(),
      }}
    >
      <Header />
    </ItemModalContext.Provider>
  );

beforeEach(() => {
  jest.clearAllMocks();
});

test('the user can open the add item modal', () => {
  renderHeader();

  fireEvent.click(screen.getByRole('button', { name: 'AddItem' }));

  expect(mockOpenModal).toHaveBeenCalled();
});

test('the user can open the scan session', () => {
  renderHeader();

  fireEvent.click(screen.getByRole('button', { name: 'Scan' }));

  expect(mockOpenScan).toHaveBeenCalled();
});

test('the user can search an item', () => {
  renderHeader();

  fireEvent.click(screen.getByRole('button', { name: 'Search' }));

  const searchInput = screen.getByRole('searchbox');
  expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: 'Manzana' } });
  expect(searchInput).toHaveValue('Manzana');
});
