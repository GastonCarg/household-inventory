import { ReactNode } from 'react';

export interface IGenericTabs extends Props {
  title: string;
  action: (value: string) => void;
  buttonPressed?: string;
  isFilter?: boolean;
}

export interface IGenericCardProps {
  id?: string;
  title: string;
  count?: string;
  expireDate?: string;
  newProduct?: boolean;
  location?: Location;
  quantity?: number;
  isDeletable?: boolean;
  onDelete?: (id: string) => void;
}

export interface Location {
  id: string | number;
  name: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

type Props = {
  children?: ReactNode;
};

export interface IFilterSearch {
  status: 'expired' | 'expiringSoon' | 'all' | 'ok';
}
