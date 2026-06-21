/** Lógica pura de tema (sem DOM), testável por unidade. */

export type Tema = 'light' | 'dark';

/**
 * Resolve o tema inicial: usa a preferência armazenada quando válida,
 * senão cai para a preferência do sistema operacional.
 */
export function resolverTemaInicial(armazenado: string | null, prefereDark: boolean): Tema {
	if (armazenado === 'light' || armazenado === 'dark') {
		return armazenado;
	}
	return prefereDark ? 'dark' : 'light';
}

/** Alterna entre claro e escuro. */
export function proximoTema(atual: Tema): Tema {
	return atual === 'dark' ? 'light' : 'dark';
}
