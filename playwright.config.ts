import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config({ path: path.join(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: './tests/specs',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 15000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Stop test execution after 20 failures */
    maxFailures: 20,
    /* Retry on CI only */
    retries: process.env.CI ? 3 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html', { open: 'never' }], ['list']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        storageState: path.join(__dirname, 'storageState.json'),
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'auth',
            testDir: './test-setup',
        },
        {
            name: 'chromium',
            dependencies: ['auth'],
            testMatch: /^((?!\/api\/).)*$/, // Exclude API tests
            use: {
                ...devices['Desktop Chrome'],
            },
        },

        {
            name: 'firefox',
            dependencies: ['auth'],
            testMatch: /^((?!\/api\/).)*$/, // Exclude API tests
            use: {
                ...devices['Desktop Firefox'],
            },
        },

        {
            name: 'webkit',
            dependencies: ['auth'],
            testMatch: /^((?!\/api\/).)*$/, // Exclude API tests
            use: {
                ...devices['Desktop Safari'],
            },
        },

        /* Test against mobile viewports. */
        {
            name: 'Mobile Chrome',
            dependencies: ['auth'],
            testMatch: /^((?!\/api\/).)*$/, // Exclude API tests
            use: {
                ...devices['Pixel 5'],
            },
        },
        {
            name: 'Mobile Safari',
            dependencies: ['auth'],
            testMatch: /^((?!\/api\/).)*$/, // Exclude API tests
            use: {
                ...devices['iPhone 13'],
            },
        },
        {
            name: 'Tablet Safari',
            dependencies: ['auth'],
            testMatch: /^((?!\/api\/).)*$/, // Exclude API tests
            use: {
                ...devices['iPad Pro 11'],
            },
        },
        /* API tests */
        {
            dependencies: ['auth'],
            name: 'API',
            testMatch: /\/api\//,
        },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge',
        //   },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

export default config;
