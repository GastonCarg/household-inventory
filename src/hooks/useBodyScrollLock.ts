import { useEffect } from 'react';

// Counts open modals so closing one doesn't unlock the page under another
let locks = 0;
let savedScrollY = 0;
let savedStyle = '';

const lock = () => {
  if (locks++ > 0) return;
  const { body } = document;
  savedScrollY = window.scrollY;
  savedStyle = body.getAttribute('style') ?? '';
  // overflow: hidden alone doesn't stop iOS Safari from scrolling the page
  // behind a modal, so pin the body in place at the current scroll position
  Object.assign(body.style, {
    position: 'fixed',
    top: `-${savedScrollY}px`,
    left: '0',
    right: '0',
    width: '100%',
    overflow: 'hidden',
  });
};

const unlock = () => {
  if (--locks > 0) return;
  const { body } = document;
  if (savedStyle) body.setAttribute('style', savedStyle);
  else body.removeAttribute('style');
  window.scrollTo(0, savedScrollY);
};

/** Prevents the page behind a modal from scrolling while it is mounted. */
export const useBodyScrollLock = () => {
  useEffect(() => {
    lock();
    return unlock;
  }, []);
};
