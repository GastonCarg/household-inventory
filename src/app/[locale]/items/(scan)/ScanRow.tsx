import { UI_CLASSES } from '@/(constants)';
import ExpirationInput from '@/components/ExpirationInput';
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

export const isRowValid = ({
  status,
  title,
  quantity,
  locationId,
  expireDate,
}: IScanRow['row']) =>
  status === 'ready' &&
  !!title.trim() &&
  quantity >= 1 &&
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
          <div
            className="border-surface-overlay flex h-[40px] items-center self-start rounded-xl border"
            role="group"
            aria-label={t('Quantity')}
          >
            <button
              type="button"
              onClick={() =>
                onChange({ quantity: Math.max(1, row.quantity - 1) })
              }
              className="text-fg-muted hover:text-fg flex h-full w-10 items-center justify-center"
              aria-label={t('Decrease')}
              disabled={row.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="text-fg min-w-8 text-center text-sm font-semibold">
              {row.quantity}
            </span>
            <button
              type="button"
              onClick={() => onChange({ quantity: row.quantity + 1 })}
              className="text-fg-muted hover:text-fg flex h-full w-10 items-center justify-center"
              aria-label={t('Increase')}
            >
              <Plus size={14} />
            </button>
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
