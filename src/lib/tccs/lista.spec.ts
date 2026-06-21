import { describe, it, expect } from 'vitest';
import {
	indexarPorId,
	montarLinhasTcc,
	classeStatus,
	atualizarStatusLinha,
	removerLinhaTcc,
	ordenarLinhas,
	filtrarLinhasPorStatus
} from './lista';
import type { TCC, Aluno, Professor } from '$lib/api/types';

const alunos: Aluno[] = [{ id: 1, nome: 'Ana', matricula: '202301', curso: 1 }];
const professores: Professor[] = [{ id: 7, nome: 'Dr. Silva', departamento: 1 }];

function fazerTcc(over: Partial<TCC> = {}): TCC {
	return {
		id: 100,
		titulo: 'Sistema X',
		resumo: '',
		palavras_chave: '',
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
		idioma_display: 'Português',
		...over
	};
}

describe('indexarPorId', () => {
	it('cria um mapa id → item', () => {
		const mapa = indexarPorId(alunos);
		expect(mapa.get(1)?.nome).toBe('Ana');
	});
});

describe('montarLinhasTcc', () => {
	it('resolve nomes de aluno e orientador', () => {
		const [linha] = montarLinhasTcc([fazerTcc()], alunos, professores);
		expect(linha.aluno).toBe('Ana');
		expect(linha.orientador).toBe('Dr. Silva');
		expect(linha.statusDisplay).toBe('Aprovado');
	});

	it('usa travessão quando o relacionamento não é encontrado', () => {
		const [linha] = montarLinhasTcc(
			[fazerTcc({ aluno: 999, orientador: 999 })],
			alunos,
			professores
		);
		expect(linha.aluno).toBe('—');
		expect(linha.orientador).toBe('—');
	});
});

describe('classeStatus', () => {
	it('mapeia o código para um modificador legível', () => {
		expect(classeStatus('0')).toBe('elaboracao');
		expect(classeStatus('1')).toBe('enviado');
		expect(classeStatus('2')).toBe('aprovado');
		expect(classeStatus('3')).toBe('reprovado');
	});
});

describe('atualizarStatusLinha', () => {
	it('atualiza apenas a linha alvo, sem mutar o array', () => {
		const original = montarLinhasTcc(
			[fazerTcc({ id: 100 }), fazerTcc({ id: 200 })],
			alunos,
			professores
		);
		const novas = atualizarStatusLinha(original, 100, '1', 'Enviado');

		expect(novas).not.toBe(original);
		expect(novas.find((l) => l.id === 100)).toMatchObject({
			status: '1',
			statusDisplay: 'Enviado'
		});
		expect(novas.find((l) => l.id === 200)?.status).toBe('2');
		expect(original.find((l) => l.id === 100)?.status).toBe('2');
	});
});

describe('removerLinhaTcc', () => {
	it('remove a linha alvo sem mutar o array', () => {
		const original = montarLinhasTcc(
			[fazerTcc({ id: 100 }), fazerTcc({ id: 200 })],
			alunos,
			professores
		);
		const novas = removerLinhaTcc(original, 100);

		expect(novas).toHaveLength(1);
		expect(novas[0].id).toBe(200);
		expect(original).toHaveLength(2);
	});
});

describe('ordenarLinhas', () => {
	it('ordena por título em ambas as direções sem mutar', () => {
		const base = montarLinhasTcc(
			[fazerTcc({ id: 1, titulo: 'Beta' }), fazerTcc({ id: 2, titulo: 'Alfa' })],
			alunos,
			professores
		);
		expect(ordenarLinhas(base, 'titulo', 'asc').map((l) => l.titulo)).toEqual(['Alfa', 'Beta']);
		expect(ordenarLinhas(base, 'titulo', 'desc').map((l) => l.titulo)).toEqual(['Beta', 'Alfa']);
		expect(base[0].titulo).toBe('Beta');
	});
});

describe('filtrarLinhasPorStatus', () => {
	it('filtra por status; vazio retorna todas', () => {
		const base = montarLinhasTcc(
			[
				fazerTcc({ id: 1, status: '2', status_display: 'Aprovado' }),
				fazerTcc({ id: 2, status: '1', status_display: 'Enviado' })
			],
			alunos,
			professores
		);
		expect(filtrarLinhasPorStatus(base, '')).toHaveLength(2);
		expect(filtrarLinhasPorStatus(base, '2').map((l) => l.id)).toEqual([1]);
	});
});
