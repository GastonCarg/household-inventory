'use client';
import React, { useContext, useEffect, useState } from 'react';

import { Filter, Loader2, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';

import {
  CARD_LEFT_BORDER,
  STATUS_COLOR_MAP,
  STATUS_ICON_MAP,
  SUMMARY_CARD_FILTER_MAP,
} from '@/(constants)';
import { ItemModalContext, SearchContext } from '@/(contexts)';
import { Card, GenericTabs, Loader } from '@/components';
import { useDeleteItem, useGetItems, useItemsSummary } from '@/hooks/useItems';
import { useGetLocations } from '@/hooks/useLocations';
import { IFilterSearch } from '@/lib/types';
import { ILocations } from './(addItem)/type';
import { ItemsListComponent } from './(ItemList)/ItemsListComponent';
import { IDefaultCards, Item } from './type';

const ItemsList: React.FC = () => {
  const t = useTranslations('ItemsList');
  const [buttonPressed, setButtonPressed] = useState(t('AllItems'));
  const { searchValue, statusFilter, filterByStatus, handleSetStatusFilter } =
    useContext(SearchContext);
  const { editItem } = useContext(ItemModalContext);

  const { data, error, fetchNextPage, status, hasNextPage } =
    useGetItems(searchValue);

  const { data: dataSummary, status: statusSummary } = useItemsSummary();
  const total = dataSummary?.total ?? 0;
  const expired = dataSummary?.expired ?? 0;
  const expiringSoon = dataSummary?.expiringSoon ?? 0;

  const SUMMARY_CARDS: IDefaultCards[] = [
    { id: 1, title: 'TotalItems', status: 'default', value: total },
    {
      id: 2,
      title: 'ExpiringSoon',
      status: 'warning',
      value: expiringSoon,
    },
    {
      id: 3,
      title: 'Expired',
      status: 'error',
      value: expired,
    },
  ];
  let buttonList = [
    {
      id: 0,
      title: t('AllItems'),
      action: (value: string) => setButtonPressed(value),
    },
  ];

  const {
    data: locations,
    error: errorLocations,
    status: statusLocations,
  } = useGetLocations();
  const mutation = useDeleteItem();

  useEffect(() => {
    if (error || errorLocations) {
      toast.error(t('ErrorFetchingItemsDetails'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, errorLocations]);

  const removeItem = (id: number | string) => {
    mutation.mutate(id);
  };

  let items: Item[] = data?.pages.flatMap(({ data }) => data) || [];

  if (searchValue) {
    items = items.filter((item: Item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (statusFilter && statusFilter.status !== 'all') {
    items = items.filter(
      (item: Item) =>
        filterByStatus(item.expireDate ?? '').status === statusFilter.status
    );
  }

  if (buttonPressed !== t('AllItems')) {
    items = items.filter((item: Item) => item.location?.name === buttonPressed);
  }

  if (
    status === 'pending' ||
    statusSummary === 'pending' ||
    statusLocations === 'pending'
  ) {
    return <Loader />;
  }

  if (locations) {
    buttonList = [
      ...buttonList,
      ...locations.map((location: ILocations) => ({
        id: location.id,
        title: location.name,
        action: (value: string) => setButtonPressed(value),
      })),
    ];
  }

  function IconSummaryItem({ status }: { status: string }) {
    const Icon = STATUS_ICON_MAP[status] ?? Package;

    return (
      <Icon
        className={`${STATUS_COLOR_MAP[status].text ?? 'text-gray-500'}`}
        size={24}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SUMMARY_CARDS.map((card) => {
          const { id, title, status, value } = card;
          return (
            <Card
              key={id}
              props={`cursor-pointer ${CARD_LEFT_BORDER[status] ?? ''}`}
              onClick={() => {
                const mapped = SUMMARY_CARD_FILTER_MAP[status] ?? 'all';
                handleSetStatusFilter({
                  status: statusFilter.status === mapped ? 'all' : mapped,
                });
              }}
            >
              <Card.Header props="justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h2
                    aria-label="title"
                    className="text-sm font-semibold tracking-wider text-[#8A90AB] uppercase"
                  >
                    {t(title)}
                  </h2>
                  <p
                    className={`text-3xl font-bold sm:text-4xl ${STATUS_COLOR_MAP[status].text}`}
                    aria-label={`${t(title)}: ${value}`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${STATUS_COLOR_MAP[status].bg}`}
                >
                  <IconSummaryItem status={status} />
                </div>
              </Card.Header>
              <Card.Content>
                <div
                  className="mt-3 h-1.5 w-full rounded-full bg-[#1E2130]"
                  aria-hidden="true"
                >
                  <div
                    className={`${STATUS_COLOR_MAP[status]?.bgSummary ?? 'bg-blue-500'} h-1.5 rounded-full`}
                    style={{
                      width: `${total > 0 ? Math.min((value / total) * 100, 100) : 0}%`,
                      transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
      <nav
        aria-label={t('FilterByLocation')}
        className="flex w-full flex-col gap-4 border-b border-[#1E2130] px-2"
      >
        <div
          role="tablist"
          aria-label={t('FilterByLocation')}
          className="scrollbar-hide flex items-center gap-1 overflow-x-auto pb-2"
        >
          {buttonList.map((button) => {
            const { id, title, action } = button;
            return (
              <GenericTabs
                key={id}
                title={title}
                action={(title) => action(title)}
                buttonPressed={buttonPressed}
              />
            );
          })}
          <div
            id="Filter"
            className="group ml-auto flex min-w-30 items-center justify-center p-3 text-[#8A90AB] transition-colors hover:text-[#F2F4FF]"
          >
            <Filter
              className="mr-2 group-hover:text-[#deff6ecc]"
              size={
                typeof window !== 'undefined' && window.innerWidth < 640
                  ? 20
                  : 18
              }
            />
            <select
              value={statusFilter.status}
              className="cursor-pointer bg-transparent px-1 text-sm font-medium text-[#8A90AB] group-hover:text-[#deff6ecc] focus:outline-none"
              aria-label="Filter items by status"
              onChange={(e) => {
                const value = e.target.value as IFilterSearch['status'];
                handleSetStatusFilter({ status: value });
              }}
            >
              <option value="all">{t('AllItems')}</option>
              <option value="ok">{t('Ok')}</option>
              <option value="expiringSoon">{t('ExpiringSoon')}</option>
              <option value="expired">{t('Expired')}</option>
            </select>
          </div>
        </div>
      </nav>
      {mutation.isPending ? (
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-lg font-medium text-[#8A90AB]">
          <Loader2 className="animate-spin text-[#deff6ecc]" size={32} />
          <p>{t('DeletingItem')}</p>
        </div>
      ) : items.length > 0 ? (
        <InfiniteScroll
          key={searchValue}
          dataLength={items.length}
          next={fetchNextPage}
          hasMore={hasNextPage || false}
          scrollThreshold={0.9}
          loader={<Loader hasMoreItems />}
        >
          <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ItemsListComponent
                  item={item}
                  removeItem={removeItem}
                  editItem={editItem}
                />
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1C1F2E]">
            <Package size={32} className="text-[#404460]" />
          </div>
          <p className="text-lg font-semibold text-[#8A90AB]">
            {t('NoItemsFound')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
