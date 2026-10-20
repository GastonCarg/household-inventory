import {
  getFrequentCatalog,
  getImageLookupStatus,
  lookupBarcode,
  lookupImage,
} from '@/api/lookup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useFrequentCatalog = () => {
  return useQuery({
    queryKey: ['catalog', 'frequent'],
    queryFn: getFrequentCatalog,
    staleTime: 5 * 60 * 1000,
  });
};

export const useImageLookupStatus = () => {
  return useQuery({
    queryKey: ['lookup', 'image', 'status'],
    queryFn: getImageLookupStatus,
    staleTime: Infinity,
    retry: false,
  });
};

/** Cached per barcode, so scanning the same product twice hits the API once. */
export const useBarcodeLookup = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (code: string) =>
      queryClient.fetchQuery({
        queryKey: ['lookup', 'barcode', code],
        queryFn: () => lookupBarcode(code),
        staleTime: 10 * 60 * 1000,
      }),
    [queryClient]
  );
};

export const useImageLookup = () => {
  return useMutation({ mutationFn: lookupImage });
};
