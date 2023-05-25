import { userData, adminData } from './lib/data';
import { test, expect } from './lib/fixtures';


test('test 1', async ({ page, storageState }) => {

  const fname = storageState?.toString().replace('/app/apps/frontend/test-results/.auth/', '').replace('.json', '');

  const parts: any = fname?.split(".");

  const tenantId = parts[0];
  const isAdmin = parts[2] === '1';

  let data = [];

  if (isAdmin) {
    data = adminData;
  } else {
    data = (userData as any)[tenantId];
  }

  const response = await page.request.get('http://backend:3333/nest/patients');

  const json = await response.json();

  expect(json).toEqual(data);
});


