import { ILocations } from '@/app/[locale]/items/type';

export interface BarcodeLookup {
  source: 'catalog' | 'openfoodfacts' | 'none';
  barcode: string;
  title: string | null;
  brand: string | null;
  imageUrl: string | null;
  suggestedLocation: ILocations | null;
  suggestedShelfLifeDays: number | null;
}

export interface ImageLookup {
  title: string;
  category: string | null;
  suggestedLocation: ILocations | null;
  suggestedShelfLifeDays: number | null;
  confidence: number;
}

export interface CatalogEntry {
  id: string | number;
  barcode: string | null;
  title: string;
  brand: string | null;
  imageUrl: string | null;
  defaultLocation: ILocations | null;
  shelfLifeDays: number | null;
  timesUsed: number;
}

export interface CapturedImage {
  imageBase64: string;
  mimeType: string;
}

export class LookupError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export const lookupBarcode = async (code: string): Promise<BarcodeLookup> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lookup/barcode/${encodeURIComponent(code)}`
    );

    if (!response.ok) {
      throw new LookupError('Failed to look up barcode', response.status);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const lookupImage = async (
  image: CapturedImage
): Promise<ImageLookup> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lookup/image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(image),
      }
    );

    if (!response.ok) {
      throw new LookupError('Failed to look up image', response.status);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getImageLookupStatus = async (): Promise<{ enabled: boolean }> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lookup/image/status`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch image lookup status');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getFrequentCatalog = async (): Promise<CatalogEntry[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/catalog/frequent?limit=12`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch frequent products');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};
