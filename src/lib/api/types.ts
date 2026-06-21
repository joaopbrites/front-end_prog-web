/**
 * Tipos que espelham os modelos da API (Django REST Framework).
 * Relacionamentos são serializados como IDs (números), não objetos aninhados.
 */

export type Status = '0' | '1' | '2' | '3';
export type Tipo = 'MONOGRAFIA' | 'RELATORIO_ESTAGIO' | 'RELATORIO_TECNICO' | 'ARTIGO';
export type Idioma = 'PT' | 'EN';

export interface UnidadeAcademica {
	id: number;
	nome: string;
	sigla: string;
}

export interface Departamento {
	id: number;
	nome: string;
	sigla: string;
	unidade_academica: number;
}

export interface Curso {
	id: number;
	nome: string;
	sigla: string;
	codigo: string;
}

export interface Aluno {
	id: number;
	nome: string;
	matricula: string;
	curso: number;
}

export interface Professor {
	id: number;
	nome: string;
	departamento: number;
}

export interface TCC {
	id: number;
	titulo: string;
	resumo: string;
	palavras_chave: string;
	tipo: Tipo;
	idioma: Idioma;
	aluno: number;
	orientador: number;
	coorientador: number | null;
	presidente: number;
	primeiro_membro: number;
	segundo_membro: number;
	semestre_letivo_defesa: string | null;
	status: Status;
	arquivo: string | null;
	/** Campos somente-leitura fornecidos pela API. */
	status_display: string;
	tipo_display: string;
	idioma_display: string;
}

/** Mapas de rótulo → contagem retornados por /tccs/estatisticas/. */
export interface Estatisticas {
	total_geral: number;
	por_status: Record<string, number>;
	por_tipo: Record<string, number>;
	por_idioma: Record<string, number>;
	por_semestre: Record<string, number>;
	por_orientador: Record<string, number>;
	por_coorientador: Record<string, number>;
	por_curso: Record<string, number>;
	por_departamento: Record<string, number>;
	por_unidade_academica: Record<string, number>;
}
