import { Unit } from '@/lib/units';
import { ILocations } from '../type';

export type ScanRowSource =
  | 'catalog'
  | 'openfoodfacts'
  | 'none'
  | 'photo'
  | 'frequent'
  | 'manual';

export interface ScanRowData {
  key: string;
  barcode?: string;
  title: string;
  quantity: number;
  unit: Unit;
  locationId: string;
  /** `YYYY-MM-DD` */
  expireDate: string;
  status: 'loading' | 'ready';
  source: ScanRowSource;
  brand?: string | null;
  imageUrl?: string | null;
  lowConfidence?: boolean;
}

export interface IScanRow {
  row: ScanRowData;
  locations: ILocations[];
  showErrors: boolean;
  onChange: (changes: Partial<ScanRowData>) => void;
  onRemove: () => void;
}

export interface IScanSession {
  closeScan: () => void;
}
