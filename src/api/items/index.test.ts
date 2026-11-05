const originalEnv = { ...process.env };

// The params depend on NODE_ENV at import time, so load a fresh module per env
const loadApi = async (env: string) => {
  (process.env as Record<string, string>).NODE_ENV = env;
  process.env.NEXT_PUBLIC_API_URL = 'http://api.test';
  let api!: typeof import('./index');
  await jest.isolateModulesAsync(async () => {
    api = await import('./index');
  });
  return api;
};
const loadGetAllItems = async (env: string) => (await loadApi(env)).getAllItems;

const fetchedUrl = () => new URL((global.fetch as jest.Mock).mock.calls[0][0]);

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  });
});

afterEach(() => {
  process.env = { ...originalEnv };
});

test('json-server is asked to sort items by expiration date', async () => {
  await (
    await loadGetAllItems('development')
  )({ page: 2 });

  const params = fetchedUrl().searchParams;
  expect(params.get('_sort')).toBe('expireDate');
  expect(params.get('_page')).toBe('2');
});

test('the Nest API is not sent a sort param (it sorts by default)', async () => {
  await (
    await loadGetAllItems('production')
  )({ page: 1 });

  const params = fetchedUrl().searchParams;
  expect(params.has('_sort')).toBe(false);
  expect(params.get('page')).toBe('1');
});

test('the summary comes from the json-server mock in development', async () => {
  await (await loadApi('development')).getItemsSummary();

  expect(fetchedUrl().pathname).toBe('/summary');
});

test('the summary comes from /products/summary on the Nest API', async () => {
  await (await loadApi('production')).getItemsSummary();

  expect(fetchedUrl().pathname).toBe('/products/summary');
});
