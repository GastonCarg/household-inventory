import { IGenericTabs } from '@/lib/types';
import React from 'react';

const GenericTabs: React.FC<IGenericTabs> = ({
  title,
  action,
  buttonPressed,
  isFilter,
  children,
}) => {
  return (
    <button
      id={title}
      role="tab"
      aria-selected={buttonPressed === title}
      className={`focus-visible:ring-primary focus-visible:ring-offset-bg flex h-8 items-center justify-center rounded-xl border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none sm:py-4 ${buttonPressed === title ? 'bg-primary text-bg border-primary shadow-sm' : 'text-fg-muted hover:text-fg hover:bg-muted border-transparent'} ${isFilter && 'ml-auto'}`}
      onClick={() => action(title)}
    >
      {children}
      <span className="text-sm sm:text-base">{title}</span>
    </button>
  );
};

export default GenericTabs;
