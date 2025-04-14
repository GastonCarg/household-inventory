import React from 'react';

interface GenericCardProps {
  title: string;
  count?: string;
  expireDate?: string;
  newProduct?: boolean;
  color?: string;
}

const GenericCard: React.FC<GenericCardProps> = ({
  title,
  count,
  expireDate,
  newProduct,
  color,
}) => {
  const colorMap: Record<string, string> = {
    black: 'text-red-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };

  const colorClass = color ? colorMap[color] || 'text-black' : 'text-black';

  if (newProduct) {
    return (
      <div className='flex flex-col items-center justify-center rounded-md border border-dashed border-gray-500 bg-gray-300 p-4 shadow-md'>
        <label className='text-gray-500'>{title}</label>
      </div>
    );
  }

  return (
    <div className='flex min-h-24 flex-col justify-between rounded-md border border-gray-300 bg-white p-4 shadow-md'>
      <h2 className='text-md'>{title}</h2>
      {count && <p className={`font-bold text-3xl ${colorClass}`}>{count}</p>}
      {expireDate && <p className='font-bold text-xl'>{expireDate}</p>}
    </div>
  );
};

export default GenericCard;
