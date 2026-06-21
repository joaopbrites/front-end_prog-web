/** Transformações puras dos dados de estatísticas em séries para gráfico/tabela. */

export interface PontoSerie {
	rotulo: string;
	valor: number;
}

/** Converte um objeto { rótulo: contagem } em uma lista de pontos. */
export function objetoParaSeries(registro: Record<string, number>): PontoSerie[] {
	return Object.entries(registro).map(([rotulo, valor]) => ({ rotulo, valor }));
}

/** Ordena por valor decrescente, sem mutar o array original. */
export function ordenarPorValor(series: PontoSerie[]): PontoSerie[] {
	return [...series].sort((a, b) => b.valor - a.valor);
}

/** Soma os valores da série. */
export function totalSerie(series: PontoSerie[]): number {
	return series.reduce((soma, ponto) => soma + ponto.valor, 0);
}
