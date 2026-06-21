import type { TCC, Aluno, Professor, Status } from '$lib/api/types';

/** Cria um mapa id → item para resolução de relacionamentos. */
export function indexarPorId<T extends { id: number }>(itens: T[]): Map<number, T> {
	return new Map(itens.map((item) => [item.id, item]));
}

/** Linha de exibição da listagem de TCCs, com nomes já resolvidos. */
export interface LinhaTcc {
	id: number;
	titulo: string;
	aluno: string;
	orientador: string;
	status: Status;
	statusDisplay: string;
	tipoDisplay: string;
	arquivo: string | null;
}

const SEM_VALOR = '—';

/**
 * Monta as linhas da listagem resolvendo aluno e orientador (que vêm como IDs)
 * para os respectivos nomes.
 */
export function montarLinhasTcc(
	tccs: TCC[],
	alunos: Aluno[],
	professores: Professor[]
): LinhaTcc[] {
	const mapaAlunos = indexarPorId(alunos);
	const mapaProfessores = indexarPorId(professores);

	return tccs.map((tcc) => ({
		id: tcc.id,
		titulo: tcc.titulo,
		aluno: mapaAlunos.get(tcc.aluno)?.nome ?? SEM_VALOR,
		orientador: mapaProfessores.get(tcc.orientador)?.nome ?? SEM_VALOR,
		status: tcc.status,
		statusDisplay: tcc.status_display,
		tipoDisplay: tcc.tipo_display,
		arquivo: tcc.arquivo
	}));
}

/** Modificador CSS para o badge de status. */
export function classeStatus(status: Status): string {
	const mapa: Record<Status, string> = {
		'0': 'elaboracao',
		'1': 'enviado',
		'2': 'aprovado',
		'3': 'reprovado'
	};
	return mapa[status] ?? 'elaboracao';
}

/** Atualiza o status e o rótulo de uma linha específica, sem mutar o array original. */
export function atualizarStatusLinha(
	linhas: LinhaTcc[],
	id: number,
	status: Status,
	statusDisplay: string
): LinhaTcc[] {
	return linhas.map((linha) => (linha.id === id ? { ...linha, status, statusDisplay } : linha));
}

/** Remove uma linha pelo id, sem mutar o array original. */
export function removerLinhaTcc(linhas: LinhaTcc[], id: number): LinhaTcc[] {
	return linhas.filter((linha) => linha.id !== id);
}

export type ColunaOrdenavel = 'titulo' | 'aluno' | 'orientador' | 'statusDisplay' | 'tipoDisplay';
export type Direcao = 'asc' | 'desc';

/** Ordena as linhas por uma coluna de texto, sem mutar o array. */
export function ordenarLinhas(
	linhas: LinhaTcc[],
	coluna: ColunaOrdenavel,
	direcao: Direcao
): LinhaTcc[] {
	const fator = direcao === 'asc' ? 1 : -1;
	return [...linhas].sort((a, b) => a[coluna].localeCompare(b[coluna], 'pt-BR') * fator);
}

/** Filtra as linhas por código de status. Status vazio retorna todas. */
export function filtrarLinhasPorStatus(linhas: LinhaTcc[], status: string): LinhaTcc[] {
	if (!status) return linhas;
	return linhas.filter((linha) => linha.status === status);
}
