import { UI_CLASSES } from '@/(constants)';
import { addDaysToToday } from '@/lib/helpers';
import { useTranslations } from 'next-intl';

const SHORTCUTS = [
  { key: 'ThreeDays', days: 3 },
  { key: 'OneWeek', days: 7 },
  { key: 'OneMonth', days: 30 },
  { key: 'ThreeMonths', days: 90 },
] as const;

interface IExpirationInput {
  id: string;
  /** `YYYY-MM-DD` */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  compact?: boolean;
  /** Needed when there is no `<label htmlFor={id}>` */
  ariaLabel?: string;
}

const ExpirationInput: React.FC<IExpirationInput> = ({
  id,
  value,
  onChange,
  disabled,
  invalid,
  compact,
  ariaLabel,
}) => {
  const t = useTranslations('ExpirationInput');

  return (
    <div className="flex flex-col gap-2">
      <input
        id={id}
        name={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${UI_CLASSES.input} ${compact ? 'min-h-[40px] p-2 text-sm' : ''} ${invalid ? 'border-red-500' : ''} [color-scheme:dark]`}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        disabled={disabled}
      />
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label={t('Shortcuts')}
      >
        {SHORTCUTS.map(({ key, days }) => {
          const date = addDaysToToday(days);
          const active = value === date;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(date)}
              disabled={disabled}
              aria-pressed={active}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-surface-overlay text-fg-muted hover:bg-divider hover:text-fg'
              }`}
            >
              {t(key)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExpirationInput;
