import { expect, test as setup, request, chromium } from '@playwright/test';
import path from 'path';
const webhookId = process.env.WEBHOOK_ID;
const webhookIdAlt = process.env.WEBHOOK_ID_ALT;
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000';

setup.describe('Authenticate test users', () => {
    setup('Primary and Secondary storage states', async () => {
        if (!webhookId || !webhookIdAlt) {
            throw new Error('Missing webhook ID, ensure WEBHOOK_ID and WEBHOOK_ID_ALT are set');
        }
        const users = [
            { webhookId: webhookId, storageState: path.join(__dirname, '../storageState.json') },
            { webhookId: webhookIdAlt, storageState: path.join(__dirname, '../storageStateAlt.json') },
        ];

        const emailLogin = async (user: { webhookId: string; storageState: string }) => {
            const apiContext = await request.newContext({ storageState: { cookies: [], origins: [] } });
            await apiContext.delete(`https://webhook.site/token/${user.webhookId}/request`);
            const browser = await chromium.launch();
            const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
            const page = await context.newPage();
            await page.goto(baseURL);
            await page.getByPlaceholder('mail@example.com').fill(`${user.webhookId}@email.webhook.site`);
            await page.getByText('Sign in with email').click();
            let responseData: any;
            await expect
                .poll(
                    async () => {
                        const response = await apiContext.get(
                            `https://webhook.site/token/${user.webhookId}/requests?page=1&sorting=newest`
                        );
                        const data = (await response.json()).data;
                        responseData = data;
                        return responseData;
                    },
                    { intervals: [500], timeout: 30000 }
                )
                .toHaveLength(1);
            const magicLink = responseData[0]['text_content'].match(/http.*site/)[0];
            await page.goto(magicLink);
            await expect(page.locator('.app-container')).toBeVisible();
            await page.context().storageState({ path: user.storageState });
            await browser.close();
        };

        const loginPromises: any[] = [];
        for (const user of users) {
            loginPromises.push(emailLogin(user));
        }
        await Promise.all(loginPromises);
    });
});
