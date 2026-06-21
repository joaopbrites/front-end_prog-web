import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const alunos = [{ id: 1, nome: 'Ana Souza', matricula: '202301', curso: 1 }];
const professores = [{ id: 7, nome: 'Dr. Ricardo', departamento: 1 }];
const tccs = [
	{
		id: 100,
		titulo: 'Sistema Web para Gestão',
		resumo: 'um resumo',
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
		arquivo: 'http://127.0.0.1:8000/media/tccs/exemplo.pdf',
		status_display: 'Aprovado',
		tipo_display: 'Monografia',
		idioma_display: 'Português'
	}
];

async function mockApi(page: Page, listaTccs = tccs) {
	await page.route(/\/api\/alunos\//, (route) => route.fulfill({ json: alunos }));
	await page.route(/\/api\/professores\//, (route) => route.fulfill({ json: professores }));
	await page.route(/\/api\/tccs\//, (route) => {
		const url = new URL(route.request().url());
		const busca = url.searchParams.get('search');
		const dados = busca
			? listaTccs.filter((t) => t.titulo.toLowerCase().includes(busca.toLowerCase()))
			: listaTccs;
		return route.fulfill({ json: dados });
	});
}

test('lista TCCs com nomes de aluno e orientador resolvidos', async ({ page }) => {
	await mockApi(page);
	await page.goto('/tccs');

	await expect(
		page.getByRole('heading', { name: 'Trabalhos de Conclusão de Curso' })
	).toBeVisible();
	const linha = page.getByRole('row', { name: /Sistema Web para Gestão/ });
	await expect(linha).toContainText('Ana Souza');
	await expect(linha).toContainText('Dr. Ricardo');
	await expect(linha).toContainText('Aprovado');
	await expect(linha.getByRole('link', { name: /Baixar PDF/ })).toBeVisible();
});

test('busca reflete na URL e refiltra a lista', async ({ page }) => {
	await mockApi(page);
	await page.goto('/tccs');

	await page.getByLabel('Buscar por título ou resumo').fill('inexistente');
	await page.getByRole('button', { name: 'Buscar' }).click();

	await expect(page).toHaveURL(/search=inexistente/);
	await expect(page.getByText(/Nenhum TCC encontrado para/)).toBeVisible();
});

test('mostra estado vazio quando não há TCCs', async ({ page }) => {
	await mockApi(page, []);
	await page.goto('/tccs');
	await expect(page.getByText('Nenhum TCC cadastrado ainda.')).toBeVisible();
});

test('não tem violações de acessibilidade (axe)', async ({ page }) => {
	await mockApi(page);
	await page.goto('/tccs');
	await expect(page.getByRole('table')).toBeVisible();

	const resultado = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();
	expect(resultado.violations).toEqual([]);
});
