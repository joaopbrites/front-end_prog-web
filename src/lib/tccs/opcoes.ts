import type { Tipo, Idioma, Status } from '$lib/api/types';

/** Opções estáticas (choices) espelhando o modelo do back-end. */

export const TIPOS: { valor: Tipo; rotulo: string }[] = [
	{ valor: 'MONOGRAFIA', rotulo: 'Monografia' },
	{ valor: 'RELATORIO_ESTAGIO', rotulo: 'Relatório de Estágio' },
	{ valor: 'RELATORIO_TECNICO', rotulo: 'Relatório Técnico' },
	{ valor: 'ARTIGO', rotulo: 'Artigo' }
];

export const IDIOMAS: { valor: Idioma; rotulo: string }[] = [
	{ valor: 'PT', rotulo: 'Português' },
	{ valor: 'EN', rotulo: 'Inglês' }
];

export const SEMESTRES: string[] = [
	'2020/1',
	'2020/2',
	'2021/1',
	'2021/2',
	'2022/1',
	'2022/2',
	'2023/1',
	'2023/2',
	'2024/1',
	'2024/2',
	'2025/1',
	'2025/2',
	'2026/1'
];

export const STATUS_OPCOES: { valor: Status; rotulo: string }[] = [
	{ valor: '0', rotulo: 'Em Elaboração' },
	{ valor: '1', rotulo: 'Enviado' },
	{ valor: '2', rotulo: 'Aprovado' },
	{ valor: '3', rotulo: 'Reprovado' }
];
