import { ReactNode } from 'react';

export interface IGenericTabs extends Props {
  title: string;
  action: (value: string) => void;
  buttonPressed?: string;
  isFilter?: boolean;
}

export interface IGenericCardProps {
  title: string;
  count?: string;
  expireDate?: string;
  newProduct?: boolean;
  location?: string;
}

type Props = {
  children?: ReactNode;
};
