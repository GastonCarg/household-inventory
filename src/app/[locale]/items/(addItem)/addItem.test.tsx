import { addDaysToToday } from '@/lib/helpers';
import { act, fireEvent, render, screen } from '@testing-library/react';
import AddItemModal from './addItem';

const mockCloseModal = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockLocations = {
  data: [
    { id: '1', name: 'Heladera' },
    { id: '2', name: 'Despensa' },
  ],
  status: 'success',
  error: null,
};

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('@/hooks/useLocations', () => ({
  useGetLocations: () => mockLocations,
}));

jest.mock('@/hooks/useItems', () => ({
  useAddItem: () => ({ mutate: mockCreate, isPending: false }),
  useUpdateItem: () => ({ mutate: mockUpdate, isPending: false }),
}));

const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText('ProductName'), {
    target: { value: 'Manzana' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'OneWeek' }));
  fireEvent.change(screen.getByLabelText('Location'), {
    target: { value: '1' },
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  mockLocations.data = [
    { id: '1', name: 'Heladera' },
    { id: '2', name: 'Despensa' },
  ];
});

test('the user can fill the add item modal', () => {
  render(<AddItemModal closeModal={mockCloseModal} />);

  expect(screen.getByText('AddItem')).toBeInTheDocument();
  expect(screen.getByLabelText('Quantity')).toHaveValue('1');
  expect(screen.getByLabelText('Label')).toHaveValue('unit');

  fillForm();

  expect(screen.getByPlaceholderText('ProductName')).toHaveValue('Manzana');
  expect(screen.getByLabelText('Expiration')).toHaveValue(addDaysToToday(7));
  expect(screen.getByLabelText('Location')).toHaveValue('1');
});

test('the user can add a new item and the modal closes', () => {
  render(<AddItemModal closeModal={mockCloseModal} />);
  fillForm();

  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(mockCreate).toHaveBeenCalledWith(
    {
      title: 'Manzana',
      quantity: 1,
      unit: 'unit',
      expireDate: expect.any(String),
      location: { id: '1', name: 'Heladera' },
    },
    expect.objectContaining({ onSuccess: expect.any(Function) })
  );

  mockCreate.mock.calls[0][1].onSuccess();
  expect(mockCloseModal).toHaveBeenCalled();
  expect(localStorage.getItem('household-inventory:lastLocationId')).toBe('1');
});

test('"save and add another" keeps the modal open with location and date', () => {
  render(<AddItemModal closeModal={mockCloseModal} />);
  fillForm();

  fireEvent.click(screen.getByRole('button', { name: 'SaveAndAddAnother' }));
  act(() => mockCreate.mock.calls[0][1].onSuccess());

  expect(mockCloseModal).not.toHaveBeenCalled();
  expect(screen.getByPlaceholderText('ProductName')).toHaveValue('');
  expect(screen.getByLabelText('Expiration')).toHaveValue(addDaysToToday(7));
  expect(screen.getByLabelText('Location')).toHaveValue('1');
});

test('the last used location is preselected', () => {
  localStorage.setItem('household-inventory:lastLocationId', '2');
  render(<AddItemModal closeModal={mockCloseModal} />);

  expect(screen.getByLabelText('Location')).toHaveValue('2');
});

test('a weight can be entered with a decimal comma', () => {
  render(<AddItemModal closeModal={mockCloseModal} />);
  fillForm();

  fireEvent.change(screen.getByLabelText('Label'), { target: { value: 'kg' } });
  fireEvent.change(screen.getByLabelText('Quantity'), {
    target: { value: '1,5' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({ quantity: 1.5, unit: 'kg' }),
    expect.anything()
  );
});

test('items counted in units need a whole quantity', () => {
  render(<AddItemModal closeModal={mockCloseModal} />);
  fillForm();

  fireEvent.change(screen.getByLabelText('Quantity'), {
    target: { value: '1,5' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

  expect(mockCreate).not.toHaveBeenCalled();
  expect(screen.getByText('QuantityRequired')).toBeInTheDocument();
});

test('missing fields show errors and nothing is sent', () => {
  render(<AddItemModal closeModal={mockCloseModal} />);

  fireEvent.submit(screen.getByTestId('addItemForm'));

  expect(mockCreate).not.toHaveBeenCalled();
  expect(screen.getByText('NameRequired')).toBeInTheDocument();
  expect(screen.getByText('ExpirationRequired')).toBeInTheDocument();
  expect(screen.getByText('LocationRequired')).toBeInTheDocument();
});

test('editing an expired item keeps its expiration date', () => {
  render(
    <AddItemModal
      closeModal={mockCloseModal}
      editingItem={{
        id: '9',
        title: 'Leche',
        quantity: 1.5,
        unit: 'l',
        expireDate: '2020-03-15T12:00:00.000Z',
        location: { id: '1', name: 'Heladera' },
      }}
    />
  );

  expect(screen.getByLabelText('Expiration')).toHaveValue('2020-03-15');
  expect(screen.getByLabelText('Label')).toHaveValue('l');

  fireEvent.click(screen.getByRole('button', { name: 'UpdateItem' }));
  expect(mockUpdate).toHaveBeenCalledWith({
    id: '9',
    item: expect.objectContaining({ title: 'Leche', quantity: 1.5, unit: 'l' }),
  });
});

test('without locations the user is sent to create one', () => {
  mockLocations.data = [];
  render(<AddItemModal closeModal={mockCloseModal} />);

  expect(screen.getByText('NoLocations')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'GoToLocations' })).toHaveAttribute(
    'href',
    '/locations'
  );
});

test('the user can close the add item modal', () => {
  render(<AddItemModal closeModal={mockCloseModal} />);

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(mockCloseModal).toHaveBeenCalled();
});
