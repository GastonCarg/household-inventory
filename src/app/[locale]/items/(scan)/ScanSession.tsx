import { UI_CLASSES } from '@/(constants)';
import { CatalogEntry, LookupError } from '@/api/lookup';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { useAddItemsBulk } from '@/hooks/useItems';
import {
  useBarcodeLookup,
  useFrequentCatalog,
  useImageLookup,
  useImageLookupStatus,
} from '@/hooks/useLookup';
import { useGetLocations } from '@/hooks/useLocations';
import { useModalA11y } from '@/hooks/useModalA11y';
import {
  addDaysToToday,
  dateInputValueToISO,
  getLastLocationId,
  setLastLocationId,
} from '@/lib/helpers';
import {
  Camera,
  Check,
  Loader2,
  Plus,
  ScanBarcode,
  Sparkles,
  X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { ILocations, Item } from '../type';
import { isRowValid, ScanRow } from './ScanRow';
import { IScanSession, ScanRowData } from './type';

const STORAGE_KEY = 'household-inventory:scanSession';
const LOW_CONFIDENCE = 0.6;
const VALID_BARCODE = /^\d{6,14}$/;
// Pause after each camera detection so the same product isn't added twice by accident
const SCAN_COOLDOWN_MS = 2000;

const createKey = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const normalize = (value: string) => value.trim().toLowerCase();

// Keeps the list if the session is closed by mistake; lookups in flight can't be resumed
const loadStoredRows = (): ScanRowData[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return (JSON.parse(stored) as ScanRowData[]).map((row) => ({
      ...row,
      status: 'ready',
    }));
  } catch {
    return [];
  }
};

const clearStoredRows = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable
  }
};

const ScanSession: React.FC<IScanSession> = ({ closeScan }) => {
  const t = useTranslations('ScanSession');
  const containerRef = useRef<HTMLDivElement>(null);
  useModalA11y(containerRef, closeScan);

  const [mode, setMode] = useState<'barcode' | 'photo'>('barcode');
  const [rows, setRows] = useState<ScanRowData[]>(loadStoredRows);
  const [showErrors, setShowErrors] = useState(false);
  const [manualCode, setManualCode] = useState('');
  // Mirror of `rows` readable from async scanner callbacks without stale closures
  const rowsRef = useRef(rows);
  const [justScanned, setJustScanned] = useState(false);
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(cooldownTimeoutRef.current), []);

  const { data: locations = [] } = useGetLocations();
  const locationIds = useMemo(
    () => new Set(locations.map((location) => String(location.id))),
    [locations]
  );
  // A row restored from storage may point to a location deleted since
  const withValidLocation = (row: ScanRowData): ScanRowData =>
    locationIds.has(row.locationId) ? row : { ...row, locationId: '' };
  const { data: frequent = [] } = useFrequentCatalog();
  const { data: imageStatus } = useImageLookupStatus();
  const photoEnabled = !!imageStatus?.enabled;
  const fetchBarcode = useBarcodeLookup();
  const imageLookup = useImageLookup();
  const bulkMutation = useAddItemsBulk(() => {
    clearStoredRows();
    closeScan();
  });

  useEffect(() => {
    rowsRef.current = rows;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {
      // Storage may be unavailable
    }
  }, [rows]);

  const defaultLocationId = useCallback(
    (suggested?: ILocations | null) => {
      const ids = locations.map((location) => String(location.id));
      if (suggested && ids.includes(String(suggested.id))) {
        return String(suggested.id);
      }
      const last = getLastLocationId();
      if (ids.includes(last)) return last;
      return ids.length === 1 ? ids[0] : '';
    },
    [locations]
  );

  const addRow = useCallback((row: ScanRowData) => {
    rowsRef.current = [row, ...rowsRef.current];
    setRows((prev) => [row, ...prev]);
  }, []);

  const updateRow = useCallback(
    (key: string, changes: Partial<ScanRowData>) => {
      setRows((prev) =>
        prev.map((row) => (row.key === key ? { ...row, ...changes } : row))
      );
    },
    []
  );

  const incrementRow = useCallback(
    (row: ScanRowData) => {
      setRows((prev) =>
        prev.map((r) =>
          r.key === row.key ? { ...r, quantity: r.quantity + 1 } : r
        )
      );
      toast.info(
        t('QuantityIncreased', { title: row.title || row.barcode || '' }),
        { autoClose: 1500 }
      );
    },
    [t]
  );

  const handleBarcode = useCallback(
    async (code: string) => {
      const existing = rowsRef.current.find((row) => row.barcode === code);
      if (existing) {
        incrementRow(existing);
        return;
      }

      const key = createKey();
      addRow({
        key,
        barcode: code,
        title: '',
        quantity: 1,
        locationId: '',
        expireDate: '',
        status: 'loading',
        source: 'none',
      });

      try {
        const result = await fetchBarcode(code);
        updateRow(key, {
          status: 'ready',
          source: result.source,
          title: result.title ?? '',
          brand: result.brand,
          imageUrl: result.imageUrl,
          locationId: defaultLocationId(result.suggestedLocation),
          expireDate: result.suggestedShelfLifeDays
            ? addDaysToToday(result.suggestedShelfLifeDays)
            : '',
        });
      } catch (error) {
        updateRow(key, { status: 'ready', locationId: defaultLocationId() });
        toast.error(t('ErrorLookingUpBarcode'));
        console.error(t('ErrorLookingUpBarcode'), error);
      }
    },
    [addRow, defaultLocationId, fetchBarcode, incrementRow, t, updateRow]
  );

  const { videoRef, status, captureFrame } = useBarcodeScanner({
    enabled: true,
    onDetect: (code) => {
      // The timeout ref doubles as the cooldown flag, readable without stale closures
      if (mode !== 'barcode' || cooldownTimeoutRef.current) return;
      setJustScanned(true);
      cooldownTimeoutRef.current = setTimeout(() => {
        cooldownTimeoutRef.current = undefined;
        setJustScanned(false);
      }, SCAN_COOLDOWN_MS);
      handleBarcode(code);
    },
  });

  const handleCapture = async () => {
    const image = captureFrame();
    if (!image) {
      toast.warning(t('CameraNotReady'));
      return;
    }

    const key = createKey();
    addRow({
      key,
      title: '',
      quantity: 1,
      locationId: '',
      expireDate: '',
      status: 'loading',
      source: 'photo',
    });

    try {
      // mutateAsync: several photos can be in flight at once
      const result = await imageLookup.mutateAsync(image);
      updateRow(key, {
        status: 'ready',
        title: result.title,
        locationId: defaultLocationId(result.suggestedLocation),
        expireDate: result.suggestedShelfLifeDays
          ? addDaysToToday(result.suggestedShelfLifeDays)
          : '',
        lowConfidence: result.confidence < LOW_CONFIDENCE,
      });
    } catch (error) {
      updateRow(key, { status: 'ready', locationId: defaultLocationId() });
      toast.error(
        error instanceof LookupError && error.status === 503
          ? t('PhotoQuotaExceeded')
          : t('ErrorRecognizingPhoto')
      );
      console.error(t('ErrorRecognizingPhoto'), error);
    }
  };

  const handleFrequent = (entry: CatalogEntry) => {
    const existing = rowsRef.current.find((row) =>
      entry.barcode
        ? row.barcode === entry.barcode
        : !row.barcode && normalize(row.title) === normalize(entry.title)
    );
    if (existing) {
      incrementRow(existing);
      return;
    }

    addRow({
      key: createKey(),
      barcode: entry.barcode ?? undefined,
      title: entry.title,
      brand: entry.brand,
      imageUrl: entry.imageUrl,
      quantity: 1,
      locationId: defaultLocationId(entry.defaultLocation),
      expireDate: entry.shelfLifeDays
        ? addDaysToToday(entry.shelfLifeDays)
        : '',
      status: 'ready',
      source: 'frequent',
    });
  };

  const handleAddManual = () => {
    addRow({
      key: createKey(),
      title: '',
      quantity: 1,
      locationId: defaultLocationId(),
      expireDate: '',
      status: 'ready',
      source: 'manual',
    });
  };

  const handleManualCode = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = manualCode.trim();
    if (!VALID_BARCODE.test(code)) {
      toast.warning(t('InvalidBarcode'));
      return;
    }
    setManualCode('');
    handleBarcode(code);
  };

  const handleClear = () => {
    setRows([]);
    setShowErrors(false);
  };

  const handleSave = () => {
    if (!rows.length) return;
    if (rows.some((row) => row.status === 'loading')) {
      toast.info(t('WaitForLookups'));
      return;
    }
    if (!rows.every((row) => isRowValid(withValidLocation(row)))) {
      setShowErrors(true);
      toast.warning(t('CompleteHighlightedRows'));
      return;
    }

    const items: Item[] = rows.map((row) => {
      const location = locations.find(
        (loc) => String(loc.id) === row.locationId
      )!;
      return {
        title: row.title.trim(),
        quantity: row.quantity,
        expireDate: dateInputValueToISO(row.expireDate),
        location: { id: location.id, name: location.name },
        ...(row.barcode && { barcode: row.barcode }),
      };
    });

    setLastLocationId(rows[0].locationId);
    bulkMutation.mutate(items);
  };

  const cameraMessage =
    status === 'denied'
      ? t('CameraDenied')
      : status === 'unavailable'
        ? t('CameraUnavailable')
        : status === 'scanning'
          ? null
          : t('StartingCamera');

  const modeButtonClasses = (active: boolean) =>
    `flex min-h-[40px] flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
      active ? 'bg-primary text-bg' : 'text-fg-muted hover:text-fg'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="scan-title"
    >
      <div
        ref={containerRef}
        className="bg-surface-modal border-surface-overlay flex h-full w-full max-w-5xl flex-col overflow-hidden border sm:h-[90vh] sm:rounded-3xl"
      >
        <header className="border-surface-overlay flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-accent-add-bg rounded-xl p-2" aria-hidden="true">
              <ScanBarcode size={18} className="text-primary" />
            </div>
            <h2
              id="scan-title"
              className="text-fg text-xl font-bold tracking-tight sm:text-2xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('Title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeScan}
            className="text-fg-dim hover:text-fg hover:bg-divider flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors"
            aria-label={t('Close')}
          >
            <X size={20} />
          </button>
        </header>

        {/* Below lg the whole body scrolls; on lg each column scrolls on its own */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          <section className="border-surface-overlay flex shrink-0 flex-col gap-3 border-b p-4 lg:w-[45%] lg:overflow-y-auto lg:border-r lg:border-b-0">
            <div
              className="border-surface-overlay flex gap-1 rounded-2xl border p-1"
              role="group"
              aria-label={t('Mode')}
            >
              <button
                type="button"
                onClick={() => setMode('barcode')}
                aria-pressed={mode === 'barcode'}
                className={modeButtonClasses(mode === 'barcode')}
              >
                <ScanBarcode size={16} />
                {t('ModeBarcode')}
              </button>
              <button
                type="button"
                onClick={() => setMode('photo')}
                aria-pressed={mode === 'photo'}
                disabled={!photoEnabled}
                title={!photoEnabled ? t('PhotoDisabled') : undefined}
                className={modeButtonClasses(mode === 'photo')}
              >
                <Camera size={16} />
                {t('ModePhoto')}
              </button>
            </div>

            <div className="relative aspect-[4/3] max-h-[34vh] w-full overflow-hidden rounded-2xl bg-black lg:max-h-none">
              <video
                ref={videoRef}
                muted
                playsInline
                className="h-full w-full object-cover"
              />
              {mode === 'barcode' && status === 'scanning' && !justScanned && (
                <div
                  aria-hidden="true"
                  className="border-primary/80 pointer-events-none absolute inset-x-[12%] top-1/2 h-1/3 -translate-y-1/2 rounded-xl border-2 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
                />
              )}
              {mode === 'barcode' && justScanned && (
                <div
                  className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 text-center"
                  role="status"
                >
                  <div className="bg-primary text-bg rounded-full p-3 shadow-lg">
                    <Check size={28} />
                  </div>
                  <p className="text-fg text-sm font-semibold">
                    {t('Scanned')}
                  </p>
                </div>
              )}
              {cameraMessage && (
                <div
                  className="text-fg-muted absolute inset-0 flex items-center justify-center p-4 text-center text-sm"
                  role="status"
                >
                  {cameraMessage}
                </div>
              )}
              {mode === 'photo' && (
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={status !== 'scanning'}
                  className="bg-primary text-bg absolute bottom-3 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full shadow-lg ring-4 ring-black/30 transition-transform active:scale-95 disabled:opacity-50"
                  aria-label={t('TakePhoto')}
                >
                  <Camera size={24} />
                </button>
              )}
            </div>
            <p className="text-fg-muted text-xs">
              {mode === 'barcode' ? t('BarcodeHint') : t('PhotoHint')}
            </p>

            <form onSubmit={handleManualCode} className="flex gap-2">
              <input
                aria-label={t('ManualBarcodeLabel')}
                placeholder={t('ManualBarcodePlaceholder')}
                inputMode="numeric"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className={`${UI_CLASSES.input} min-h-[40px] min-w-0 flex-1 p-2 text-sm`}
              />
              <button
                type="submit"
                className={`${UI_CLASSES.buttonSecondary} min-h-[40px] px-3 text-sm`}
              >
                {t('AddBarcode')}
              </button>
            </form>
          </section>

          <section className="flex flex-1 flex-col lg:min-h-0">
            {frequent.length > 0 && (
              <div className="border-surface-overlay border-b px-4 py-3">
                <p
                  className={`${UI_CLASSES.label} mb-2 flex items-center gap-1`}
                >
                  <Sparkles size={12} aria-hidden="true" />
                  {t('Frequent')}
                </p>
                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                  {frequent.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => handleFrequent(entry)}
                      className="border-surface-overlay text-fg-secondary hover:border-primary/50 hover:text-fg shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors"
                    >
                      {entry.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 px-4 pt-3">
              <p className="text-fg-muted text-sm font-semibold">
                {t('ProductsCount', { count: rows.length })}
              </p>
              <div className="flex gap-1">
                {rows.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-fg-dim min-h-[36px] rounded-xl px-3 text-xs font-medium hover:text-red-400"
                  >
                    {t('ClearList')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddManual}
                  className="text-primary hover:bg-divider flex min-h-[36px] items-center gap-1 rounded-xl px-3 text-xs font-semibold"
                >
                  <Plus size={14} />
                  {t('AddManually')}
                </button>
              </div>
            </div>

            {rows.length > 0 ? (
              <ul className="flex-1 space-y-3 p-4 lg:overflow-y-auto">
                {rows.map((row) => (
                  <ScanRow
                    key={row.key}
                    row={withValidLocation(row)}
                    locations={locations}
                    showErrors={showErrors}
                    onChange={(changes) => updateRow(row.key, changes)}
                    onRemove={() =>
                      setRows((prev) => prev.filter((r) => r.key !== row.key))
                    }
                  />
                ))}
              </ul>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                <ScanBarcode size={32} className="text-fg-dim" />
                <p className="text-fg font-semibold">{t('EmptyTitle')}</p>
                <p className="text-fg-muted max-w-xs text-sm">
                  {t('EmptyDescription')}
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="border-surface-overlay flex flex-col gap-3 border-t p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeScan}
            className={`${UI_CLASSES.buttonSecondary} order-2 min-h-[44px] px-5 py-3 sm:order-1`}
          >
            {t('Cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!rows.length || bulkMutation.isPending}
            className={`${UI_CLASSES.buttonPrimary} order-1 flex min-h-[44px] items-center justify-center gap-2 px-5 py-3 shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:order-2`}
          >
            {bulkMutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {bulkMutation.isPending
              ? t('Saving')
              : t('Save', { count: rows.length })}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ScanSession;
