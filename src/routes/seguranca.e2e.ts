import { test, expect } from '@playwright/test';

test('respostas trazem cabeçalhos de segurança', async ({ page }) => {
	const resposta = await page.goto('/');
	const headers = resposta!.headers();

	expect(headers['x-content-type-options']).toBe('nosniff');
	expect(headers['x-frame-options']).toBe('DENY');
	expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
});
