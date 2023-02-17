import { chromium, request, expect } from '@playwright/test';
require('dotenv').config();

export default async () => {
    const users = [
        { webhookId: process.env.WEBHOOK_ID ?? '', storageState: 'storageState.json' },
        { webhookId: process.env.WEBHOOK_ID_ALT ?? '', storageState: 'storageStateAlt.json' },
    ];
    const emailLogin = async (user: { webhookId: string; storageState: string }) => {
        const apiContext = await request.newContext();
        await apiContext.delete(`https://webhook.site/token/${user.webhookId}/request`);
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(process.env.BASE_URL ?? '');
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
                { intervals: [500], timeout: 20000 }
            )
            .toHaveLength(1);
        const magicLink = responseData[0]['text_content'].match(/http.*site/)[0];
        await page.goto(magicLink);
        await expect(page.locator('.app-container')).toBeVisible();
        await page.context().storageState({ path: user.storageState });
        await browser.close();
    };
    const loginPromises = [];
    for (const user of users) {
        loginPromises.push(emailLogin(user));
    }
    await Promise.all(loginPromises);
};
