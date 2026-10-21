'use client';

import { Unit, UNITS } from '@/lib/units';
import { useTranslations } from 'next-intl';

interface UnitSelectProps {
  id?: string;
  value: Unit;
  onChange: (unit: Unit) => void;
  className?: string;
  disabled?: boolean;
}

const UnitSelect = ({
  id,
  value,
  onChange,
  className,
  disabled,
}: UnitSelectProps) => {
  const t = useTranslations('Units');

  return (
    <select
      id={id}
      aria-label={id ? undefined : t('Label')}
      value={value}
      onChange={(e) => onChange(e.target.value as Unit)}
      className={className}
      disabled={disabled}
    >
      {UNITS.map((unit) => (
        <option key={unit} value={unit}>
          {t(`Names.${unit}`)}
        </option>
      ))}
    </select>
  );
};

export default UnitSelect;
