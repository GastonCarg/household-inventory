import { addDaysToToday } from '@/lib/helpers';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { toast } from 'react-toastify';
import ScanSession from './ScanSession';

const mockCloseScan = jest.fn();
const mockFetchBarcode = jest.fn();
const mockImageLookup = jest.fn();
const mockBulkMutate = jest.fn();
const mockCaptureFrame = jest.fn();
let mockOnDetect: (code: string) => void = () => {};
let mockImageEnabled = true;
let mockFrequent: object[] = [];

jest.mock('next-intl', () => ({
  useTranslations:
    () => (key: string, values?: Record<string, string | number>) =>
      values ? `${key} ${Object.values(values).join(' ')}` : key,
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('@/hooks/useBarcodeScanner', () => ({
  useBarcodeScanner: ({ onDetect }: { onDetect: (code: string) => void }) => {
    mockOnDetect = onDetect;
    return {
      videoRef: { current: null },
      status: 'scanning',
      captureFrame: mockCaptureFrame,
    };
  },
}));

jest.mock('@/hooks/useLookup', () => ({
  useBarcodeLookup: () => mockFetchBarcode,
  useImageLookup: () => ({ mutateAsync: mockImageLookup }),
  useImageLookupStatus: () => ({ data: { enabled: mockImageEnabled } }),
  useFrequentCatalog: () => ({ data: mockFrequent }),
}));

jest.mock('@/hooks/useLocations', () => ({
  useGetLocations: () => ({
    data: [
      { id: '1', name: 'Heladera' },
      { id: '2', name: 'Freezer' },
    ],
  }),
}));

jest.mock('@/hooks/useItems', () => ({
  useAddItemsBulk: () => ({ mutate: mockBulkMutate, isPending: false }),
}));

const detect = async (code: string) => {
  await act(async () => {
    mockOnDetect(code);
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  localStorage.clear();
  mockImageEnabled = true;
  mockFrequent = [];
});

test('a scanned barcode is looked up and added to the list', async () => {
  mockFetchBarcode.mockResolvedValue({
    source: 'openfoodfacts',
    barcode: '7790080000000',
    title: 'Leche entera 1 L',
    brand: 'La Serenísima',
    imageUrl: null,
    suggestedLocation: { id: '1', name: 'Heladera' },
    suggestedShelfLifeDays: 10,
  });
  render(<ScanSession closeScan={mockCloseScan} />);

  await detect('7790080000000');

  expect(mockFetchBarcode).toHaveBeenCalledWith('7790080000000');
  expect(screen.getByLabelText('ProductName')).toHaveValue('Leche entera 1 L');
  expect(screen.getByLabelText('Location')).toHaveValue('1');
  expect(screen.getByLabelText('Expiration')).toHaveValue(addDaysToToday(10));

  fireEvent.click(screen.getByRole('button', { name: 'Save 1' }));

  expect(mockBulkMutate).toHaveBeenCalledWith([
    {
      title: 'Leche entera 1 L',
      quantity: 1,
      expireDate: expect.any(String),
      location: { id: '1', name: 'Heladera' },
      barcode: '7790080000000',
    },
  ]);
});

test('scanning the same barcode again increases the quantity', async () => {
  mockFetchBarcode.mockResolvedValue({
    source: 'catalog',
    barcode: '7790080000000',
    title: 'Yogur',
    brand: null,
    imageUrl: null,
    suggestedLocation: null,
    suggestedShelfLifeDays: null,
  });
  jest.useFakeTimers();
  render(<ScanSession closeScan={mockCloseScan} />);

  await detect('7790080000000');
  act(() => {
    jest.advanceTimersByTime(2000);
  });
  await detect('7790080000000');

  expect(mockFetchBarcode).toHaveBeenCalledTimes(1);
  expect(screen.getAllByLabelText('ProductName')).toHaveLength(1);
  expect(screen.getByText('2')).toBeInTheDocument();
  jest.useRealTimers();
});

test('scanning pauses for 2 seconds after each detection', async () => {
  mockFetchBarcode.mockResolvedValue({
    source: 'catalog',
    barcode: '7790080000000',
    title: 'Yogur',
    brand: null,
    imageUrl: null,
    suggestedLocation: null,
    suggestedShelfLifeDays: null,
  });
  jest.useFakeTimers();
  render(<ScanSession closeScan={mockCloseScan} />);

  await detect('7790080000000');
  expect(screen.getByText('Scanned')).toBeInTheDocument();

  await detect('7790080000001');
  expect(mockFetchBarcode).toHaveBeenCalledTimes(1);

  act(() => {
    jest.advanceTimersByTime(2000);
  });
  expect(screen.queryByText('Scanned')).not.toBeInTheDocument();

  await detect('7790080000001');
  expect(mockFetchBarcode).toHaveBeenCalledTimes(2);
  jest.useRealTimers();
});

test('an unknown product must be completed before saving', async () => {
  mockFetchBarcode.mockResolvedValue({
    source: 'none',
    barcode: '7790080000001',
    title: null,
    brand: null,
    imageUrl: null,
    suggestedLocation: null,
    suggestedShelfLifeDays: null,
  });
  render(<ScanSession closeScan={mockCloseScan} />);

  await detect('7790080000001');
  expect(screen.getByText('NotFoundHint')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Save 1' }));
  expect(mockBulkMutate).not.toHaveBeenCalled();
  expect(toast.warning).toHaveBeenCalledWith('CompleteHighlightedRows');

  fireEvent.change(screen.getByLabelText('ProductName'), {
    target: { value: 'Alfajor' },
  });
  fireEvent.change(screen.getByLabelText('Location'), {
    target: { value: '2' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'OneMonth' }));
  fireEvent.click(screen.getByRole('button', { name: 'Save 1' }));

  expect(mockBulkMutate).toHaveBeenCalledWith([
    expect.objectContaining({
      title: 'Alfajor',
      barcode: '7790080000001',
      location: { id: '2', name: 'Freezer' },
    }),
  ]);
});

test('a photo is recognized and flagged when confidence is low', async () => {
  mockCaptureFrame.mockReturnValue({
    imageBase64: 'abc',
    mimeType: 'image/jpeg',
  });
  mockImageLookup.mockResolvedValue({
    title: 'Carne picada',
    category: 'carne',
    suggestedLocation: { id: '2', name: 'Freezer' },
    suggestedShelfLifeDays: 90,
    confidence: 0.4,
  });
  render(<ScanSession closeScan={mockCloseScan} />);

  fireEvent.click(screen.getByRole('button', { name: 'ModePhoto' }));
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'TakePhoto' }));
  });

  expect(mockImageLookup).toHaveBeenCalledWith({
    imageBase64: 'abc',
    mimeType: 'image/jpeg',
  });
  expect(screen.getByLabelText('ProductName')).toHaveValue('Carne picada');
  expect(screen.getByLabelText('Location')).toHaveValue('2');
  expect(screen.getByText('LowConfidence')).toBeInTheDocument();
});

test('only one photo is recognized at a time', async () => {
  mockCaptureFrame.mockReturnValue({
    imageBase64: 'abc',
    mimeType: 'image/jpeg',
  });
  let resolveLookup: (value: object) => void = () => {};
  mockImageLookup.mockReturnValue(
    new Promise((resolve) => {
      resolveLookup = resolve;
    })
  );
  render(<ScanSession closeScan={mockCloseScan} />);

  fireEvent.click(screen.getByRole('button', { name: 'ModePhoto' }));
  const takePhoto = screen.getByRole('button', { name: 'TakePhoto' });
  fireEvent.click(takePhoto);
  fireEvent.click(takePhoto);

  expect(mockImageLookup).toHaveBeenCalledTimes(1);
  expect(takePhoto).toBeDisabled();
  expect(screen.getByText('Recognizing')).toBeInTheDocument();

  await act(async () => {
    resolveLookup({
      title: 'Carne picada',
      category: 'carne',
      suggestedLocation: { id: '2', name: 'Freezer' },
      suggestedShelfLifeDays: 90,
      confidence: 0.9,
    });
  });

  expect(takePhoto).toBeEnabled();
  expect(screen.getByText('Recognized')).toBeInTheDocument();
});

test('switching mode right after a photo clears the success and the cooldown', async () => {
  mockCaptureFrame.mockReturnValue({
    imageBase64: 'abc',
    mimeType: 'image/jpeg',
  });
  mockImageLookup.mockResolvedValue({
    title: 'Carne picada',
    category: 'carne',
    suggestedLocation: { id: '2', name: 'Freezer' },
    suggestedShelfLifeDays: 90,
    confidence: 0.9,
  });
  mockFetchBarcode.mockResolvedValue({
    source: 'catalog',
    barcode: '7790080000000',
    title: 'Yogur',
    brand: null,
    imageUrl: null,
    suggestedLocation: null,
    suggestedShelfLifeDays: null,
  });
  render(<ScanSession closeScan={mockCloseScan} />);

  fireEvent.click(screen.getByRole('button', { name: 'ModePhoto' }));
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'TakePhoto' }));
  });
  expect(screen.getByText('Recognized')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'ModeBarcode' }));
  expect(screen.queryByText('Scanned')).not.toBeInTheDocument();

  await detect('7790080000000');
  expect(mockFetchBarcode).toHaveBeenCalledWith('7790080000000');
});

test('the photo button is enabled again when recognition fails', async () => {
  mockCaptureFrame.mockReturnValue({
    imageBase64: 'abc',
    mimeType: 'image/jpeg',
  });
  mockImageLookup.mockRejectedValue(new Error('boom'));
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  render(<ScanSession closeScan={mockCloseScan} />);

  fireEvent.click(screen.getByRole('button', { name: 'ModePhoto' }));
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'TakePhoto' }));
  });

  expect(toast.error).toHaveBeenCalledWith('ErrorRecognizingPhoto');
  expect(screen.getByRole('button', { name: 'TakePhoto' })).toBeEnabled();
  expect(screen.queryByText('Recognized')).not.toBeInTheDocument();
  consoleError.mockRestore();
});

test('photo mode is disabled when the server has no Gemini key', () => {
  mockImageEnabled = false;
  render(<ScanSession closeScan={mockCloseScan} />);

  expect(screen.getByRole('button', { name: 'ModePhoto' })).toBeDisabled();
});

test('barcodes are ignored while in photo mode', async () => {
  render(<ScanSession closeScan={mockCloseScan} />);

  fireEvent.click(screen.getByRole('button', { name: 'ModePhoto' }));
  await detect('7790080000000');

  expect(mockFetchBarcode).not.toHaveBeenCalled();
});

test('a frequent product is added with one tap', () => {
  mockFrequent = [
    {
      id: 1,
      barcode: null,
      title: 'Pan',
      brand: null,
      imageUrl: null,
      defaultLocation: { id: '1', name: 'Heladera' },
      shelfLifeDays: 5,
      timesUsed: 3,
    },
  ];
  render(<ScanSession closeScan={mockCloseScan} />);

  fireEvent.click(screen.getByRole('button', { name: 'Pan' }));

  expect(screen.getByLabelText('ProductName')).toHaveValue('Pan');
  expect(screen.getByLabelText('Expiration')).toHaveValue(addDaysToToday(5));
});

test('an invalid manual code is rejected', () => {
  render(<ScanSession closeScan={mockCloseScan} />);

  fireEvent.change(screen.getByLabelText('ManualBarcodeLabel'), {
    target: { value: '12ab' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'AddBarcode' }));

  expect(toast.warning).toHaveBeenCalledWith('InvalidBarcode');
  expect(mockFetchBarcode).not.toHaveBeenCalled();
});

test('the list survives closing the session by mistake', async () => {
  mockFetchBarcode.mockResolvedValue({
    source: 'catalog',
    barcode: '7790080000000',
    title: 'Yogur',
    brand: null,
    imageUrl: null,
    suggestedLocation: null,
    suggestedShelfLifeDays: null,
  });
  const { unmount } = render(<ScanSession closeScan={mockCloseScan} />);
  await detect('7790080000000');
  unmount();

  render(<ScanSession closeScan={mockCloseScan} />);

  expect(screen.getByLabelText('ProductName')).toHaveValue('Yogur');
});

test('a restored row whose location was deleted must pick a new one', () => {
  sessionStorage.setItem(
    'household-inventory:scanSession',
    JSON.stringify([
      {
        key: 'restored',
        title: 'Yogur',
        quantity: 1,
        locationId: '99',
        expireDate: addDaysToToday(5),
        status: 'ready',
        source: 'manual',
      },
    ])
  );
  render(<ScanSession closeScan={mockCloseScan} />);

  expect(screen.getByLabelText('Location')).toHaveValue('');

  fireEvent.click(screen.getByRole('button', { name: 'Save 1' }));

  expect(toast.warning).toHaveBeenCalledWith('CompleteHighlightedRows');
  expect(mockBulkMutate).not.toHaveBeenCalled();
});
