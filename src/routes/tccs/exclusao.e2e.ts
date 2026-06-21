import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

async function mock(page: Page) {
	await page.route(/\/api\/alunos\//, (route) => route.fulfill({ json: alunos }));
	await page.route(/\/api\/professores\//, (route) => route.fulfill({ json: professores }));
	await page.route(/\/api\/tccs\//, (route) => route.fulfill({ json: [tcc] }));
	await page.route(/\/api\/tccs\/100\//, (route) => {
		if (route.request().method() === 'DELETE') {
			return route.fulfill({ status: 204, body: '' });
		}
		return route.fulfill({ json: tcc });
	});
}

test('exclui um TCC após confirmação no diálogo', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs');

	await page.getByRole('button', { name: /Excluir.*Sistema Web para Gestão/ }).click();
	const dialogo = page.getByRole('dialog');
	await expect(dialogo).toBeVisible();
	await expect(dialogo).toContainText(/não pode ser desfeita/);

	await dialogo.getByRole('button', { name: 'Excluir', exact: true }).click();

	await expect(page.getByText(/excluído/)).toBeVisible();
	await expect(page.getByRole('row', { name: /Sistema Web para Gestão/ })).toHaveCount(0);
});

test('cancela a exclusão com Esc e mantém o TCC', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs');

	await page.getByRole('button', { name: /Excluir.*Sistema Web para Gestão/ }).click();
	await expect(page.getByRole('dialog')).toBeVisible();

	await page.keyboard.press('Escape');

	await expect(page.getByRole('dialog')).toBeHidden();
	await expect(page.getByRole('row', { name: /Sistema Web para Gestão/ })).toHaveCount(1);
});

test('diálogo de exclusão sem violações de acessibilidade (axe)', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs');

	await page.getByRole('button', { name: /Excluir.*Sistema Web para Gestão/ }).click();
	await expect(page.getByRole('dialog')).toBeVisible();

	const resultado = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();
	expect(resultado.violations).toEqual([]);
});
