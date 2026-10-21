import { fireEvent, render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  usePathname: () => '/',
}));

test('the brand is shown in the sidebar and the mobile top bar', () => {
  render(<Sidebar />);

  expect(
    screen.getByRole('heading', { name: 'HouseholdInventory' })
  ).toBeInTheDocument();
  expect(screen.getAllByText('HouseholdInventory')).toHaveLength(2);
});

test('the user can open and close the mobile menu', () => {
  render(<Sidebar />);
  const openButton = screen.getByRole('button', { name: 'OpenMenu' });

  fireEvent.click(openButton);
  expect(openButton).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(screen.getByRole('button', { name: 'CloseMenu' }));
  expect(openButton).toHaveAttribute('aria-expanded', 'false');
});
