'use client';

import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  CloseButtonProps,
  IconProps,
  Slide,
  ToastContainer,
} from 'react-toastify';

const ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
  default: Info,
} as const;

const ToastIcon = ({ type }: IconProps) => {
  const Icon = ICONS[type];
  return (
    <span className="app-toast-icon" aria-hidden="true">
      <Icon size={18} strokeWidth={2.25} />
    </span>
  );
};

const CloseButton = ({ closeToast }: CloseButtonProps) => {
  const t = useTranslations('Notifications');
  return (
    <button
      type="button"
      className="app-toast-close"
      onClick={closeToast}
      aria-label={t('Close')}
    >
      <X size={16} />
    </button>
  );
};

/** Single, app-themed notification area shared by every page. */
const AppToaster = () => (
  <ToastContainer
    position="top-right"
    theme="dark"
    transition={Slide}
    autoClose={3500}
    limit={3}
    newestOnTop
    pauseOnFocusLoss={false}
    icon={ToastIcon}
    closeButton={CloseButton}
  />
);

export default AppToaster;
