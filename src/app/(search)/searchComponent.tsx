'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { SearchContext } from '@/(contexts)';

const SearchComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const { handleSetSearchValue } = useContext(SearchContext);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Search');

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClickSearch = () => {
    setIsInputVisible(true);
    setTimeout(() => searchInputRef.current?.focus(), 300);
  };

  const getResults = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsInputVisible(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSetSearchValue(inputValue);
    }, 600);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  return (
    <div role="search" className="flex w-full items-center gap-2 sm:w-auto">
      {!isInputVisible && inputValue === '' && (
        <button
          onClick={handleClickSearch}
          aria-label={t('Search')}
          aria-expanded={false}
          type="button"
          className="border-divider bg-surface-elevated hover:bg-divider hover:border-primary/40 text-fg-muted hover:text-fg flex max-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-150 sm:w-auto"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">{t('Search')}</span>
        </button>
      )}

      {(isInputVisible || inputValue !== '') && (
        <input
          type="search"
          ref={searchInputRef}
          aria-label={t('Search')}
          placeholder={`${t('Search')}...`}
          className="bg-surface-elevated border-divider focus:ring-primary/30 focus:border-primary text-fg placeholder:text-fg-dim max-h-10 w-full rounded-xl border px-4 py-2.5 text-base transition-all focus:ring-2 focus:outline-none sm:w-auto"
          value={inputValue}
          onChange={handleInputValue}
          onKeyUp={getResults}
          onBlur={() => {
            if (inputValue === '') setIsInputVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchComponent;
