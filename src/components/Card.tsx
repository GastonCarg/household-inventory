import { ReactNode } from "react";

export default function Card({
  children,
  props,
}: {
  children: ReactNode;
  props?: string;
}): React.JSX.Element {
  return (
    <div
      className={`flex min-h-28 flex-col rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 ${props}`}
    >
      {children}
    </div>
  );
}

Card.Header = function HeaderCard({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex items-start justify-between mb-3">{children}</div>
  );
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
}: {
  children: ReactNode;
}): React.JSX.Element {
  return <div className="flex justify-end mt-2">{children}</div>;
};
