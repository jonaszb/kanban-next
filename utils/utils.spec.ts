import { randomHexColor } from './utils';

describe('utils', () => {
    test('randomHexColor generates a valid color', () => {
        for (let i = 0; i < 1000; i++) {
            const color = randomHexColor();
            expect(color).toMatch(/^#[0-9a-f]{6}$/);
        }
    });
});
