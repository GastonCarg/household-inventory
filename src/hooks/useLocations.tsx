import { addLocation, deleteLocation, getLocations } from '@/api/locations';
import { Location } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

export const useGetLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    staleTime: Infinity,
  });
};

export const useAddLocation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Locations');

  return useMutation({
    mutationFn: addLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(t('LocationAddedSuccessfully'));
    },
    onError: (error) => {
      toast.error(t('ErrorAddingLocation'));
      console.error(t('ErrorAddingLocationLog'), error);
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('Locations');

  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Location[]>(['locations'], (oldLocations = []) =>
        oldLocations.filter((location) => String(location.id) !== String(id))
      );
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(t('LocationDeletedSuccessfully'));
    },
    onError: (error) => {
      toast.error(t('ErrorDeletingLocation'));
      console.error(t('ErrorDeletingLocationLog'), error);
    },
  });
};
