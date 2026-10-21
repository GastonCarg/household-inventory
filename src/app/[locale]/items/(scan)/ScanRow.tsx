import { UI_CLASSES } from '@/(constants)';
import ExpirationInput from '@/components/ExpirationInput';
import UnitSelect from '@/components/UnitSelect';
import {
  isValidQuantity,
  parseQuantity,
  roundQuantity,
  Unit,
  UNIT_STEP,
} from '@/lib/units';
import {
  Camera,
  Loader2,
  Minus,
  Package,
  Plus,
  ScanBarcode,
  Sparkles,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IScanRow, ScanRowSource } from './type';

const SOURCE_LABEL: Record<ScanRowSource, string> = {
  catalog: 'SourceCatalog',
  openfoodfacts: 'SourceOpenFoodFacts',
  none: 'SourceNone',
  photo: 'SourcePhoto',
  frequent: 'SourceFrequent',
  manual: 'SourceManual',
};

const SOURCE_ICON: Record<ScanRowSource, React.ElementType> = {
  catalog: Sparkles,
  openfoodfacts: ScanBarcode,
  none: ScanBarcode,
  photo: Camera,
  frequent: Sparkles,
  manual: Package,
};

// Decimal comma to match how amounts are typed in the app's main locale
const formatDraft = (quantity: number) => String(quantity).replace('.', ',');

export const isRowValid = ({
  status,
  title,
  quantity,
  unit,
  locationId,
  expireDate,
}: IScanRow['row']) =>
  status === 'ready' &&
  !!title.trim() &&
  isValidQuantity(quantity, unit) &&
  !!locationId &&
  !!expireDate;

export function ScanRow({
  row,
  locations,
  showErrors,
  onChange,
  onRemove,
}: IScanRow) {
  const t = useTranslations('ScanSession');
  const isLoading = row.status === 'loading';
  const SourceIcon = SOURCE_ICON[row.source];
  const invalid = (missing: boolean) => showErrors && !isLoading && missing;
  const step = UNIT_STEP[row.unit];

  // Typed text is kept as a draft and committed on blur, so "1," can be typed on the way to "1,5"
  const [draft, setDraft] = useState(() => formatDraft(row.quantity));
  useEffect(() => {
    setDraft(formatDraft(row.quantity));
  }, [row.quantity]);

  const changeQuantity = (quantity: number) =>
    onChange({ quantity: roundQuantity(Math.max(quantity, step)) });

  const commitDraft = () => {
    const quantity = parseQuantity(draft);
    if (isValidQuantity(quantity, row.unit)) {
      onChange({ quantity: roundQuantity(quantity) });
    }
    setDraft(formatDraft(row.quantity));
  };

  // Switching to units needs a whole amount; weights and volumes keep what was typed
  const changeUnit = (unit: Unit) =>
    onChange({
      unit,
      ...(unit === 'unit' && {
        quantity: Math.max(1, Math.round(row.quantity)),
      }),
    });

  return (
    <li
      className={`bg-surface-elevated rounded-2xl border p-3 ${
        showErrors && !isRowValid(row)
          ? 'border-red-500/60'
          : 'border-surface-overlay'
      }`}
      aria-busy={isLoading || undefined}
    >
      <div className="flex items-start gap-3">
        <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl">
          {row.imageUrl ? (
            // External Open Food Facts thumbnail; next/image would need remote host config
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : isLoading ? (
            <Loader2 size={20} className="text-primary animate-spin" />
          ) : (
            <SourceIcon size={20} className="text-fg-dim" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {isLoading ? (
            <p className="text-fg-muted py-2 text-sm">{t('LookingUp')}</p>
          ) : (
            <input
              aria-label={t('ProductName')}
              placeholder={t('ProductName')}
              value={row.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={`${UI_CLASSES.input} min-h-[40px] p-2 text-sm ${invalid(!row.title.trim()) ? 'border-red-500' : ''}`}
            />
          )}
          <div className="text-fg-dim flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span>{t(SOURCE_LABEL[row.source])}</span>
            {row.brand && <span>· {row.brand}</span>}
            {row.barcode && <span className="font-mono">· {row.barcode}</span>}
          </div>
          {row.lowConfidence && (
            <p className="flex items-center gap-1 text-xs text-amber-400">
              <TriangleAlert size={12} aria-hidden="true" />
              {t('LowConfidence')}
            </p>
          )}
          {row.source === 'none' && !isLoading && !row.title && (
            <p className="text-xs text-amber-400">{t('NotFoundHint')}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-fg-dim flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl transition-colors hover:bg-red-950/40 hover:text-red-400"
          aria-label={`${t('Remove')} ${row.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {!isLoading && (
        <div className="mt-3 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex items-center gap-2 self-start">
            <div
              className={`flex h-[40px] items-center rounded-xl border ${invalid(!isValidQuantity(row.quantity, row.unit)) ? 'border-red-500' : 'border-surface-overlay'}`}
              role="group"
              aria-label={t('Quantity')}
            >
              <button
                type="button"
                onClick={() => changeQuantity(row.quantity - step)}
                className="text-fg-muted hover:text-fg flex h-full w-10 items-center justify-center disabled:opacity-40"
                aria-label={t('Decrease')}
                disabled={row.quantity <= step}
              >
                <Minus size={14} />
              </button>
              <input
                aria-label={t('Quantity')}
                inputMode={row.unit === 'unit' ? 'numeric' : 'decimal'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitDraft}
                className="text-fg w-14 bg-transparent text-center text-sm font-semibold outline-none"
              />
              <button
                type="button"
                onClick={() => changeQuantity(row.quantity + step)}
                className="text-fg-muted hover:text-fg flex h-full w-10 items-center justify-center"
                aria-label={t('Increase')}
              >
                <Plus size={14} />
              </button>
            </div>
            <UnitSelect
              value={row.unit}
              onChange={changeUnit}
              className={`${UI_CLASSES.input} min-h-[40px] w-auto cursor-pointer p-2 text-sm`}
            />
          </div>
          <select
            aria-label={t('Location')}
            value={row.locationId}
            onChange={(e) => onChange({ locationId: e.target.value })}
            className={`${UI_CLASSES.input} min-h-[40px] cursor-pointer p-2 text-sm ${invalid(!row.locationId) ? 'border-red-500' : ''}`}
          >
            <option value="">{t('SelectLocation')}</option>
            {locations.map((location) => (
              <option key={location.id} value={String(location.id)}>
                {location.name}
              </option>
            ))}
          </select>
          <div className="sm:col-span-2">
            <ExpirationInput
              id={`expiration-${row.key}`}
              value={row.expireDate}
              onChange={(expireDate) => onChange({ expireDate })}
              invalid={invalid(!row.expireDate)}
              ariaLabel={t('Expiration')}
              compact
            />
          </div>
        </div>
      )}
    </li>
  );
}
