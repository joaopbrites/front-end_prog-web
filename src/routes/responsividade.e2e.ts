import { test, expect, type Page } from '@playwright/test';

const tcc = {
	id: 1,
	titulo: 'Sistema Web para Gestão Acadêmica',
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

async function semOverflowHorizontal(page: Page) {
	// Overflow ao nível da PÁGINA (body). Tabelas largas rolam dentro de .tabela-scroll,
	// o que é um padrão aceito pelo WCAG 1.4.10 (reflow) para conteúdo tabular.
	const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
	expect(overflow).toBeLessThanOrEqual(1);
}

test('home não tem rolagem horizontal de página em 320px (reflow WCAG)', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 720 });
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await semOverflowHorizontal(page);
});

test('listagem de TCCs não estoura a largura da página em 375px', async ({ page }) => {
	await page.route(/\/api\/alunos\//, (route) =>
		route.fulfill({ json: [{ id: 1, nome: 'Ana', matricula: '202301', curso: 1 }] })
	);
	await page.route(/\/api\/professores\//, (route) =>
		route.fulfill({ json: [{ id: 7, nome: 'Dr. Ricardo', departamento: 1 }] })
	);
	await page.route(/\/api\/tccs\//, (route) => route.fulfill({ json: [tcc] }));

	await page.setViewportSize({ width: 375, height: 720 });
	await page.goto('/tccs');
	await expect(page.getByRole('heading', { name: /Trabalhos de Conclusão/ })).toBeVisible();
	// A tabela larga rola dentro do seu contêiner (.tabela-scroll), sem estourar a página.
	await semOverflowHorizontal(page);
});
