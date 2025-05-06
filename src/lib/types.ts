import { ReactNode } from 'react';

export interface IGenericTabs extends Props {
  title: string;
  action: (value: string) => void;
  buttonPressed?: string;
  isFilter?: boolean;
}

type Props = {
  children?: ReactNode;
};
