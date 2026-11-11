import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from './useBodyScrollLock';

const scrollTo = jest.fn();

beforeEach(() => {
  scrollTo.mockClear();
  window.scrollTo = scrollTo;
  Object.defineProperty(window, 'scrollY', { value: 250, configurable: true });
  document.body.removeAttribute('style');
});

test('the page behind a modal cannot scroll while it is open', () => {
  renderHook(() => useBodyScrollLock());

  expect(document.body.style.position).toBe('fixed');
  expect(document.body.style.top).toBe('-250px');
  expect(document.body.style.overflow).toBe('hidden');
});

test('closing the modal restores the page and its scroll position', () => {
  const { unmount } = renderHook(() => useBodyScrollLock());
  unmount();

  expect(document.body.getAttribute('style')).toBeNull();
  expect(scrollTo).toHaveBeenCalledWith(0, 250);
});

test('the page stays locked until every open modal is closed', () => {
  const first = renderHook(() => useBodyScrollLock());
  const second = renderHook(() => useBodyScrollLock());

  first.unmount();
  expect(document.body.style.position).toBe('fixed');

  second.unmount();
  expect(document.body.style.position).toBe('');
  expect(scrollTo).toHaveBeenCalledTimes(1);
});
