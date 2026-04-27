'use client';

import { Card, Loader } from '@/components';
import {
  useAddLocation,
  useDeleteLocation,
  useGetLocations,
} from '@/hooks/useLocations';
import { Location } from '@/lib/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormEvent, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const LocationsContent = () => {
  const t = useTranslations('Locations');
  const [name, setName] = useState('');
  const { data: locations = [], status } = useGetLocations();
  const addMutation = useAddLocation();
  const deleteMutation = useDeleteLocation();

  const sortedLocations = useMemo(
    () =>
      [...locations].sort((left, right) => left.name.localeCompare(right.name)),
    [locations]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.warning(t('NameRequired'));
      return;
    }

    addMutation.mutate(
      { name: trimmedName },
      {
        onSuccess: () => {
          setName('');
        },
      }
    );
  };

  const handleDelete = (locationId: string) => {
    deleteMutation.mutate(locationId);
  };

  if (status === 'pending') {
    return <Loader />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-5 pt-20 sm:p-6 sm:pt-24 lg:pt-8">
      <section className="relative overflow-hidden rounded-[28px] border border-[var(--color-divider)] bg-[linear-gradient(135deg,rgba(26,29,40,0.98),rgba(17,19,24,0.96))] p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(222,255,110,0.24),transparent_68%)]" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-fg-muted text-xs font-semibold tracking-[0.32em] uppercase">
              {t('Eyebrow')}
            </p>
            <h1
              className="text-fg mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('Title')}
            </h1>
            <p className="text-fg-secondary mt-3 max-w-xl text-sm leading-6 sm:text-base">
              {t('Description')}
            </p>
          </div>

          <div className="border-divider bg-surface-elevated inline-flex items-center gap-3 self-start rounded-2xl border px-4 py-3">
            <div className="bg-primary/15 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-fg-muted text-xs font-semibold tracking-[0.24em] uppercase">
                {t('CounterLabel')}
              </p>
              <p
                className="text-fg text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {locations.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Card props="h-fit gap-5 rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="bg-accent-add-bg rounded-2xl p-3">
              <Plus className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2
                className="text-fg text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('AddTitle')}
              </h2>
              <p className="text-fg-muted mt-1 text-sm">
                {t('AddDescription')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="location-name"
                className="text-fg-muted text-xs font-semibold tracking-[0.24em] uppercase"
              >
                {t('NameLabel')}
              </label>
              <input
                id="location-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t('NamePlaceholder')}
                className="bg-surface-input border-divider text-fg placeholder:text-fg-dim focus:border-primary min-h-[48px] rounded-2xl border px-4 py-3 text-base transition-colors outline-none"
                disabled={addMutation.isPending}
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-bg flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              disabled={addMutation.isPending}
            >
              <Plus className="h-4 w-4" />
              <span>
                {addMutation.isPending ? t('Adding') : t('AddAction')}
              </span>
            </button>
          </form>
        </Card>

        <section className="grid gap-4">
          {sortedLocations.length > 0 ? (
            sortedLocations.map((location: Location) => (
              <Card key={location.id} props="rounded-[26px] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/12 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-fg-muted text-xs font-semibold tracking-[0.24em] uppercase">
                        {t('LocationCardLabel')}
                      </p>
                      <h3
                        className="text-fg mt-1 text-2xl font-bold tracking-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {location.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(String(location.id))}
                    className="border-divider text-fg-secondary flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border px-4 py-3 transition-colors hover:border-red-500/30 hover:bg-red-950/30 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={deleteMutation.isPending}
                    aria-label={`${t('Delete')} ${location.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t('Delete')}</span>
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <Card props="rounded-[28px] border-dashed p-8 sm:p-10">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-3xl">
                  <MapPin className="text-fg-dim h-7 w-7" />
                </div>
                <div>
                  <h2
                    className="text-fg text-3xl font-bold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t('EmptyTitle')}
                  </h2>
                  <p className="text-fg-secondary mt-2 max-w-md text-sm leading-6 sm:text-base">
                    {t('EmptyDescription')}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

const LocationsPage = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LocationsContent />
      <ToastContainer />
    </QueryClientProvider>
  );
};

export default LocationsPage;
