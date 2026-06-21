import { test, expect, type Page } from '@playwright/test';

const alunos = [{ id: 1, nome: 'Ana Souza', matricula: '202301', curso: 1 }];
const professores = [{ id: 7, nome: 'Dr. Ricardo', departamento: 1 }];
const tcc = {
	id: 100,
	titulo: 'Sistema Web para Gestão',
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
	status: '2',
	arquivo: null,
	status_display: 'Aprovado',
	tipo_display: 'Monografia',
	idioma_display: 'Português'
};

const ROTULOS: Record<string, string> = {
	'0': 'Em Elaboração',
	'1': 'Enviado',
	'2': 'Aprovado',
	'3': 'Reprovado'
};

async function mock(page: Page, { falharPatch = false } = {}) {
	await page.route(/\/api\/alunos\//, (route) => route.fulfill({ json: alunos }));
	await page.route(/\/api\/professores\//, (route) => route.fulfill({ json: professores }));
	await page.route(/\/api\/tccs\//, (route) => route.fulfill({ json: [tcc] }));
	// Rota específica do PATCH (registrada por último para ter precedência).
	await page.route(/\/api\/tccs\/100\//, (route) => {
		if (route.request().method() === 'PATCH') {
			if (falharPatch) return route.fulfill({ status: 500, json: { detail: 'erro' } });
			const novo = String(route.request().postDataJSON().status);
			return route.fulfill({ json: { ...tcc, status: novo, status_display: ROTULOS[novo] } });
		}
		return route.fulfill({ json: tcc });
	});
}

test('altera o status e exibe toast de sucesso', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs');

	const select = page.getByLabel('Alterar status de Sistema Web para Gestão');
	await expect(select).toHaveValue('2');

	await select.selectOption('1');

	await expect(page.getByText(/atualizado para Enviado/)).toBeVisible();
	await expect(select).toHaveValue('1');
	await expect(
		page.getByRole('row', { name: /Sistema Web para Gestão/ }).locator('.badge')
	).toHaveText('Enviado');
});

test('exibe toast de erro e reverte quando a alteração falha', async ({ page }) => {
	await mock(page, { falharPatch: true });
	await page.goto('/tccs');

	const select = page.getByLabel('Alterar status de Sistema Web para Gestão');
	await select.selectOption('3');

	await expect(page.getByText(/Não foi possível alterar o status/)).toBeVisible();
	await expect(select).toHaveValue('2');
});
