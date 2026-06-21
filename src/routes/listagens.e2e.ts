import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const cursos = [
	{ id: 1, nome: 'Ciência da Computação', sigla: 'BCC', codigo: 'G010' },
	{ id: 2, nome: 'Matemática', sigla: 'MAT', codigo: 'G015' }
];
const alunos = [{ id: 1, nome: 'Ana Souza', matricula: '202301', curso: 1 }];

async function mock(page: Page) {
	await page.route(/\/api\/cursos\//, (route) => route.fulfill({ json: cursos }));
	await page.route(/\/api\/alunos\//, (route) => {
		const url = new URL(route.request().url());
		const s = url.searchParams.get('search');
		const data = s
			? alunos.filter(
					(a) => a.nome.toLowerCase().includes(s.toLowerCase()) || a.matricula.includes(s)
				)
			: alunos;
		return route.fulfill({ json: data });
	});
}

test('Alunos: lista com curso resolvido e busca refletida na URL', async ({ page }) => {
	await mock(page);
	await page.goto('/alunos');

	const linha = page.getByRole('row', { name: /Ana Souza/ });
	await expect(linha).toContainText('202301');
	await expect(linha).toContainText('Ciência da Computação');

	await page.getByLabel('Buscar por nome ou matrícula').fill('zzz');
	await page.getByRole('button', { name: 'Buscar' }).click();
	await expect(page).toHaveURL(/search=zzz/);
	await expect(page.getByText(/Nenhum resultado para/)).toBeVisible();
});

test('Cursos: filtro client-side por texto (sem busca no back-end)', async ({ page }) => {
	await mock(page);
	await page.goto('/cursos');

	await expect(page.getByRole('row', { name: /Ciência da Computação/ })).toBeVisible();
	await expect(page.getByRole('row', { name: /Matemática/ })).toBeVisible();

	await page.getByLabel('Buscar por nome, sigla ou código').fill('matem');
	await page.getByRole('button', { name: 'Buscar' }).click();

	await expect(page.getByRole('row', { name: /Matemática/ })).toBeVisible();
	await expect(page.getByRole('row', { name: /Ciência da Computação/ })).toHaveCount(0);
});

test('Alunos: sem violações de acessibilidade (axe)', async ({ page }) => {
	await mock(page);
	await page.goto('/alunos');
	await expect(page.getByRole('table')).toBeVisible();

	const resultado = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();
	expect(resultado.violations).toEqual([]);
});
