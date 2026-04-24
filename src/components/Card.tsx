import { ReactNode } from 'react';

export default function Card({
  children,
  props,
  onClick,
  tabIndex,
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  props?: string;
  onClick?: () => void;
  tabIndex?: number;
  'aria-label'?: string;
}): React.JSX.Element {
  return (
    <article
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={`border-divider bg-surface focus-visible:ring-primary focus-visible:ring-offset-bg flex min-h-28 flex-col rounded-2xl border p-4 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-5 ${props}`}
    >
      {children}
    </article>
  );
}

Card.Header = function HeaderCard({
  children,
  props = '',
}: {
  children: ReactNode;
  props?: string;
}): React.JSX.Element {
  return <div className={`flex ${props}`}>{children}</div>;
};

Card.Content = function ContentCard({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  return <div className="flex-1">{children}</div>;
};

Card.Footer = function FooterCard({
  children,
  props,
}: {
  children: ReactNode;
  props?: string;
}): React.JSX.Element {
  return <div className={`mt-2 flex ${props}`}>{children}</div>;
};
