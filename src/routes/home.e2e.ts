import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home institucional exibe seções principais', async ({ page }) => {
	await page.goto('/');

	await expect(
		page.getByRole('heading', { name: 'Sistema de Gestão de TCCs', level: 1 })
	).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Como cadastrar um TCC' })).toBeVisible();
	await expect(
		page.getByRole('region', { name: 'Atalhos' }).getByRole('link', { name: /Ver TCCs/ })
	).toBeVisible();
});

test('home sem violações de acessibilidade (axe)', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

	const resultado = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();
	expect(resultado.violations).toEqual([]);
});
