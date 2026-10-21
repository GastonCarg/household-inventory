import { isValidQuantity, parseQuantity, roundQuantity } from './units';

test('a decimal comma or point is accepted', () => {
  expect(parseQuantity('1,5')).toBe(1.5);
  expect(parseQuantity(' 0.25 ')).toBe(0.25);
  expect(parseQuantity('')).toBeNaN();
  expect(parseQuantity('abc')).toBeNaN();
});

test('units need whole amounts; weights and volumes can be fractional', () => {
  expect(isValidQuantity(2, 'unit')).toBe(true);
  expect(isValidQuantity(1.5, 'unit')).toBe(false);
  expect(isValidQuantity(1.5, 'kg')).toBe(true);
  expect(isValidQuantity(0, 'g')).toBe(false);
  expect(isValidQuantity(NaN, 'l')).toBe(false);
});

test('stepper float noise is rounded away', () => {
  expect(roundQuantity(0.1 + 0.2)).toBe(0.3);
});
