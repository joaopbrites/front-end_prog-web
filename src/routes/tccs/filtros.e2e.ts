import { test, expect, type Page } from '@playwright/test';

const alunos = [{ id: 1, nome: 'Ana Souza', matricula: '202301', curso: 1 }];
const professores = [{ id: 7, nome: 'Dr. Ricardo', departamento: 1 }];

function fazerTcc(id: number, titulo: string, status: string, statusDisplay: string) {
	return {
		id,
		titulo,
		resumo: 'r',
		palavras_chave: 'web',
		tipo: 'MONOGRAFIA',
		idioma: 'PT',
		aluno: 1,
		orientador: 7,
		coorientador: null,
		presidente: 7,
		primeiro_membro: 7,
		segundo_membro: 7,
		semestre_letivo_defesa: '2024/1',
		status,
		arquivo: null,
		status_display: statusDisplay,
		tipo_display: 'Monografia',
		idioma_display: 'Português'
	};
}

const tccs = [fazerTcc(2, 'Beta', '1', 'Enviado'), fazerTcc(1, 'Alfa', '2', 'Aprovado')];

async function mock(page: Page) {
	await page.route(/\/api\/alunos\//, (route) => route.fulfill({ json: alunos }));
	await page.route(/\/api\/professores\//, (route) => route.fulfill({ json: professores }));
	await page.route(/\/api\/tccs\//, (route) => route.fulfill({ json: tccs }));
}

test('ordena por título ao clicar no cabeçalho', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs');

	// Padrão: ascendente → Alfa primeiro.
	await expect(page.locator('tbody tr').first()).toContainText('Alfa');

	await page.getByRole('button', { name: /Título/ }).click();

	// Após o clique: descendente → Beta primeiro.
	await expect(page.locator('tbody tr').first()).toContainText('Beta');
});

test('filtra por status e reflete na URL', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs');

	await page.getByLabel('Filtrar por status').selectOption('2');

	await expect(page).toHaveURL(/status=2/);
	await expect(page.getByRole('row', { name: /Alfa/ })).toBeVisible();
	await expect(page.getByRole('row', { name: /Beta/ })).toHaveCount(0);
});
