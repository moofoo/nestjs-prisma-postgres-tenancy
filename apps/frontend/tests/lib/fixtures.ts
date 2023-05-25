import { test as baseTest, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { getUser } from './get-user';
export * from '@playwright/test';

export const test = baseTest.extend<{}, { workerStorageState: string; }>({
      storageState: ({ workerStorageState }, use) => use(workerStorageState),

      workerStorageState: [async ({ }, use) => {

            const { user, pass, id: tenantId, userId } = getUser();

            let isAdmin = 0;
            if (user.includes('admin')) {
                  isAdmin = 1;
            }

            const fileName = path.resolve(test.info().project.outputDir, `.auth/${tenantId}.${userId}.${isAdmin}.json`);

            if (fs.existsSync(fileName)) {
                  await use(fileName);
                  return;
            }

            const context = await request.newContext({ storageState: undefined });

            await context.post('http://backend:3333/nest/auth/login', {
                  data: {
                        userName: user,
                        password: pass
                  }, ignoreHTTPSErrors: true, timeout: 5000
            });

            await context.storageState({ path: fileName });
            await context.dispose();
            await use(fileName);

      }, { scope: 'worker' }],
});