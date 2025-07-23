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
  location?: string;
  quantity?: number;
  isDeletable?: boolean;
  onDelete?: (id: string) => void;
}

type Props = {
  children?: ReactNode;
};
