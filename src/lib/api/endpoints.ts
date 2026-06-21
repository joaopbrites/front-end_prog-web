import { api, type ApiClient } from './client';
import type {
	TCC,
	Aluno,
	Professor,
	Curso,
	Departamento,
	UnidadeAcademica,
	Estatisticas,
	Status
} from './types';

/** Funções de acesso à API por recurso. O cliente é injetável (testes). */

export function listarTccs(search?: string, cliente: ApiClient = api): Promise<TCC[]> {
	return cliente.get<TCC[]>('/tccs/', { search });
}

/** Cadastra um TCC. Recebe FormData (multipart) para suportar upload de PDF. */
export function criarTcc(dados: FormData, cliente: ApiClient = api): Promise<TCC> {
	return cliente.post<TCC>('/tccs/', dados);
}

/** Exclui um TCC. */
export function excluirTcc(id: number, cliente: ApiClient = api): Promise<void> {
	return cliente.del(`/tccs/${id}/`);
}

export function listarAlunos(search?: string, cliente: ApiClient = api): Promise<Aluno[]> {
	return cliente.get<Aluno[]>('/alunos/', { search });
}

export function listarProfessores(search?: string, cliente: ApiClient = api): Promise<Professor[]> {
	return cliente.get<Professor[]>('/professores/', { search });
}

export function listarCursos(cliente: ApiClient = api): Promise<Curso[]> {
	return cliente.get<Curso[]>('/cursos/');
}

export function listarDepartamentos(cliente: ApiClient = api): Promise<Departamento[]> {
	return cliente.get<Departamento[]>('/departamentos/');
}

export function listarUnidades(cliente: ApiClient = api): Promise<UnidadeAcademica[]> {
	return cliente.get<UnidadeAcademica[]>('/unidades-academicas/');
}

export function obterEstatisticas(cliente: ApiClient = api): Promise<Estatisticas> {
	return cliente.get<Estatisticas>('/tccs/estatisticas/');
}

/** Altera o status de um TCC (PATCH parcial). */
export function alterarStatusTcc(
	id: number,
	status: Status,
	cliente: ApiClient = api
): Promise<TCC> {
	return cliente.patch<TCC>(`/tccs/${id}/`, { status });
}
