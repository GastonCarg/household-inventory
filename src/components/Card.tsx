import { ReactNode } from "react";

export default function Card({
  children,
  props,
  onClick,
}: {
  children: ReactNode;
  props?: string;
  onClick?: () => void;
}): React.JSX.Element {
  return (
    <div
      onClick={onClick}
      className={`flex min-h-28 flex-col rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 ${props}`}
    >
      {children}
    </div>
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
