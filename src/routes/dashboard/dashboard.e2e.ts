import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const estatisticas = {
	total_geral: 42,
	por_status: { Aprovado: 20, 'Em Elaboração': 10, Enviado: 8, Reprovado: 4 },
	por_tipo: { Monografia: 30, Artigo: 12 },
	por_idioma: { Português: 35, Inglês: 7 },
	por_semestre: { '2024/1': 12, '2024/2': 30 },
	por_orientador: { 'Dr. Ricardo': 15, 'Dra. Paula': 27 },
	por_coorientador: {},
	por_curso: { 'Ciência da Computação': 42 },
	por_departamento: { DCC: 42 },
	por_unidade_academica: { ICET: 42 }
};

async function mock(page: Page) {
	await page.route(/\/api\/tccs\/estatisticas\//, (route) => route.fulfill({ json: estatisticas }));
}

test('dashboard exibe total e tabelas de estatísticas', async ({ page }) => {
	await mock(page);
	await page.goto('/dashboard');

	await expect(page.getByRole('heading', { name: 'Dashboard de TCCs' })).toBeVisible();
	await expect(page.getByText('TCCs no total')).toBeVisible();

	// Tabela alternativa do gráfico de status (acessível).
	await expect(page.getByRole('row', { name: /Aprovado/ })).toContainText('20');
	await expect(page.getByRole('row', { name: /Monografia/ })).toContainText('30');
});

test('dashboard sem violações de acessibilidade (axe)', async ({ page }) => {
	await mock(page);
	await page.goto('/dashboard');
	await expect(page.getByRole('row', { name: /Aprovado/ })).toBeVisible();

	const resultado = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();
	expect(resultado.violations).toEqual([]);
});

test('dashboard: gráfico não se sobrepõe à tabela (layout sem bug)', async ({ page }) => {
	await mock(page);
	await page.goto('/dashboard');
	await expect(page.getByRole('table').first()).toBeVisible();
	await page.waitForTimeout(200);

	// Em cada seção com gráfico, o gráfico deve terminar acima da tabela (sem colisão vertical).
	const pares = await page.evaluate(() => {
		const res: { gBottom: number; tTop: number }[] = [];
		document.querySelectorAll('section').forEach((sec) => {
			const grafico = sec.querySelector('.grafico');
			const tabela = sec.querySelector('table');
			if (grafico && tabela) {
				res.push({
					gBottom: grafico.getBoundingClientRect().bottom,
					tTop: tabela.getBoundingClientRect().top
				});
			}
		});
		return res;
	});

	expect(pares.length).toBeGreaterThan(0);
	for (const par of pares) {
		expect(par.gBottom).toBeLessThanOrEqual(par.tTop + 2);
	}
});
