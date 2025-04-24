'use client';

import { useContext, useEffect, useState } from 'react';
import SearchContext from '../../(contexts)/searchContext/page';

const Header = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const { handleSetSearchValue } = useContext(SearchContext);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSetSearchValue(inputValue);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <header className='flex h-16 items-center justify-between border-b border-gray-300 bg-white'>
      <label className='p-4 text-2xl font-bold'>Food Inventory</label>
      <div className='grid grid-flow-col gap-4 p-4'>
        <input
          type='search'
          placeholder='Search...'
          className='rounded-md bg-gray-200 p-2 focus:ring-2 focus:ring-green-500 focus:outline-none'
          value={inputValue}
          onChange={ev => handleInputValue(ev)}
        />
        <button className='rounded-md bg-green-600 border-none p-2' onMouseUp={() => alert('Open modal')}>
          Add Item
        </button>
      </div>
    </header>
  );
};

export default Header;
