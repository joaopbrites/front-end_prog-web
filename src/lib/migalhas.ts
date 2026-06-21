/** Construção pura da trilha de navegação (breadcrumbs) a partir da rota. */

export interface Migalha {
	rotulo: string;
	href: string;
	atual: boolean;
}

export const ROTULOS_ROTAS: Record<string, string> = {
	tccs: 'TCCs',
	novo: 'Cadastrar',
	alunos: 'Alunos',
	professores: 'Professores',
	cursos: 'Cursos',
	departamentos: 'Departamentos',
	unidades: 'Unidades Acadêmicas',
	dashboard: 'Dashboard'
};

/** Gera as migalhas a partir do pathname. Retorna [] na home. */
export function construirMigalhas(
	pathname: string,
	rotulos: Record<string, string> = ROTULOS_ROTAS
): Migalha[] {
	const segmentos = pathname.split('/').filter(Boolean);
	if (segmentos.length === 0) return [];

	const migalhas: Migalha[] = [{ rotulo: 'Início', href: '/', atual: false }];
	let acumulado = '';
	segmentos.forEach((segmento, i) => {
		acumulado += `/${segmento}`;
		migalhas.push({
			rotulo: rotulos[segmento] ?? segmento,
			href: acumulado,
			atual: i === segmentos.length - 1
		});
	});
	return migalhas;
}
