import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const alunos = [{ id: 1, nome: 'Ana Souza', matricula: '202301', curso: 1 }];
const professores = [
	{ id: 7, nome: 'Dr. Ricardo', departamento: 1 },
	{ id: 8, nome: 'Dra. Paula', departamento: 1 },
	{ id: 9, nome: 'Dr. João', departamento: 1 }
];

async function mock(page: Page) {
	await page.route(/\/api\/alunos\//, (route) => route.fulfill({ json: alunos }));
	await page.route(/\/api\/professores\//, (route) => route.fulfill({ json: professores }));
	await page.route(/\/api\/tccs\//, (route) => {
		if (route.request().method() === 'POST') {
			return route.fulfill({ status: 201, json: { id: 500 } });
		}
		return route.fulfill({ json: [] });
	});
}

async function preencherObrigatorios(page: Page) {
	await page.fill('#titulo', 'Meu Trabalho de Conclusão');
	await page.fill('#resumo', 'Resumo do trabalho.');
	await page.fill('#palavras_chave', 'web, teste');
	await page.selectOption('#tipo', 'MONOGRAFIA');
	await page.selectOption('#idioma', 'PT');
	await page.selectOption('#aluno', '1');
	await page.selectOption('#orientador', '7');
	await page.selectOption('#presidente', '7');
	await page.selectOption('#primeiro_membro', '8');
	await page.selectOption('#segundo_membro', '9');
}

test('cadastra um TCC válido e redireciona para a listagem', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs/novo');
	await expect(page.getByRole('button', { name: 'Cadastrar TCC' })).toBeVisible();

	await preencherObrigatorios(page);
	await page.getByRole('button', { name: 'Cadastrar TCC' }).click();

	await expect(page).toHaveURL(/\/tccs$/);
});

test('bloqueia envio e mostra resumo de erros quando vazio', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs/novo');
	await expect(page.getByRole('button', { name: 'Cadastrar TCC' })).toBeVisible();

	await page.getByRole('button', { name: 'Cadastrar TCC' }).click();

	await expect(page.getByText(/precisam ser corrigidos|precisa ser corrigido/)).toBeVisible();
	await expect(page).toHaveURL(/\/tccs\/novo$/);
});

test('rejeita arquivo que não é PDF', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs/novo');
	await expect(page.getByRole('button', { name: 'Cadastrar TCC' })).toBeVisible();

	await page.setInputFiles('#arquivo', {
		name: 'documento.txt',
		mimeType: 'text/plain',
		buffer: Buffer.from('conteúdo')
	});

	await expect(page.getByText(/formato PDF/)).toBeVisible();
});

test('formulário sem violações de acessibilidade (axe)', async ({ page }) => {
	await mock(page);
	await page.goto('/tccs/novo');
	await expect(page.getByRole('button', { name: 'Cadastrar TCC' })).toBeVisible();

	const resultado = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();
	expect(resultado.violations).toEqual([]);
});
