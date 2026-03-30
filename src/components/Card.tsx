import { ReactNode } from "react";

export default function Card({
  children,
  props,
  onClick,
  tabIndex,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  props?: string;
  onClick?: () => void;
  tabIndex?: number;
  "aria-label"?: string;
}): React.JSX.Element {
  return (
    <article
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={`flex min-h-28 flex-col rounded-2xl border border-divider bg-surface p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition-[transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${props}`}
    >
      {children}
    </article>
  );
}

Card.Header = function HeaderCard({
  children,
  props = "",
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
  return <div className={`flex mt-2 ${props}`}>{children}</div>;
};
