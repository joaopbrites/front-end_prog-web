/** Filtro de texto client-side (para recursos sem busca no back-end). */

/** Normaliza para comparação: remove acentos, baixa a caixa e apara espaços. */
export function normalizar(texto: string): string {
	return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/**
 * Filtra os itens cujo conteúdo de algum dos campos contém o termo,
 * ignorando acentos e caixa. Termo vazio retorna todos os itens.
 */
export function filtrarPorTexto<T>(itens: T[], termo: string, campos: (item: T) => string[]): T[] {
	const alvo = normalizar(termo);
	if (!alvo) return itens;
	return itens.filter((item) => campos(item).some((campo) => normalizar(campo).includes(alvo)));
}
