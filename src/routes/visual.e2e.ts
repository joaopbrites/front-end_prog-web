import { test, expect, type Page } from '@playwright/test';

// Dados fixos para renderização determinística.
const alunos = [{ id: 1, nome: 'Ana Souza', matricula: '202301', curso: 1 }];
const professores = [
	{ id: 7, nome: 'Dr. Ricardo', departamento: 1 },
	{ id: 8, nome: 'Dra. Paula', departamento: 1 },
	{ id: 9, nome: 'Dr. João', departamento: 1 }
];

function fazerTcc(
	id: number,
	titulo: string,
	status: string,
	statusDisplay: string,
	arquivo: string | null
) {
	return {
		id,
		titulo,
		resumo: 'Resumo do trabalho.',
		palavras_chave: 'web, dados',
		tipo: 'MONOGRAFIA',
		idioma: 'PT',
		aluno: 1,
		orientador: 7,
		coorientador: null,
		presidente: 7,
		primeiro_membro: 8,
		segundo_membro: 9,
		semestre_letivo_defesa: '2024/1',
		status,
		arquivo,
		status_display: statusDisplay,
		tipo_display: 'Monografia',
		idioma_display: 'Português'
	};
}

const tccs = [
	fazerTcc(
		1,
		'Análise de Dados Educacionais',
		'2',
		'Aprovado',
		'http://127.0.0.1:8000/media/tccs/a.pdf'
	),
	fazerTcc(2, 'Sistema Web para Gestão', '1', 'Enviado', null)
];

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

async function mockApi(page: Page) {
	await page.route(/\/api\/alunos\//, (route) => route.fulfill({ json: alunos }));
	await page.route(/\/api\/professores\//, (route) => route.fulfill({ json: professores }));
	// A rota ampla de /tccs/ é registrada ANTES da específica de estatísticas,
	// pois o Playwright avalia as rotas na ordem inversa de registro (a última vence).
	await page.route(/\/api\/tccs\//, (route) => route.fulfill({ json: tccs }));
	await page.route(/\/api\/tccs\/estatisticas\//, (route) => route.fulfill({ json: estatisticas }));
}

const paginas = [
	{ nome: 'home', url: '/', pronto: (p: Page) => p.getByRole('heading', { level: 1 }) },
	{ nome: 'listagem', url: '/tccs', pronto: (p: Page) => p.getByRole('table') },
	{
		nome: 'formulario',
		url: '/tccs/novo',
		pronto: (p: Page) => p.getByRole('button', { name: 'Cadastrar TCC' })
	},
	{ nome: 'dashboard', url: '/dashboard', pronto: (p: Page) => p.getByRole('table').first() }
];

const temas = ['light', 'dark'] as const;

for (const tema of temas) {
	for (const pagina of paginas) {
		test(`visual: ${pagina.nome} (${tema})`, async ({ page, browserName }) => {
			test.skip(browserName !== 'chromium', 'Regressão visual roda apenas no chromium.');

			await mockApi(page);
			// Força o tema antes de qualquer script da página (o script inline lê o localStorage).
			await page.addInitScript((t) => localStorage.setItem('tema', t), tema);
			await page.setViewportSize({ width: 1280, height: 800 });

			await page.goto(pagina.url);
			await pagina.pronto(page).first().waitFor();

			// Garante que o tema foi aplicado e o botão de tema já sincronizou (onMount).
			await expect(page.locator('html')).toHaveAttribute('data-tema', tema);
			await expect(
				page.getByRole('button', { name: tema === 'dark' ? 'Tema claro' : 'Tema escuro' })
			).toBeVisible();

			await expect(page).toHaveScreenshot(`${pagina.nome}-${tema}.png`, { fullPage: true });
		});
	}
}
