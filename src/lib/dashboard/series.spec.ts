import { describe, it, expect } from 'vitest';
import { objetoParaSeries, ordenarPorValor, totalSerie } from './series';

describe('objetoParaSeries', () => {
	it('converte objeto rótulo→contagem em lista de pontos', () => {
		expect(objetoParaSeries({ Aprovado: 3, Enviado: 1 })).toEqual([
			{ rotulo: 'Aprovado', valor: 3 },
			{ rotulo: 'Enviado', valor: 1 }
		]);
	});

	it('retorna lista vazia para objeto vazio', () => {
		expect(objetoParaSeries({})).toEqual([]);
	});
});

describe('ordenarPorValor', () => {
	it('ordena por valor decrescente sem mutar a entrada', () => {
		const entrada = [
			{ rotulo: 'a', valor: 1 },
			{ rotulo: 'b', valor: 5 },
			{ rotulo: 'c', valor: 3 }
		];
		const ordenada = ordenarPorValor(entrada);
		expect(ordenada.map((p) => p.rotulo)).toEqual(['b', 'c', 'a']);
		expect(entrada[0].rotulo).toBe('a');
	});
});

describe('totalSerie', () => {
	it('soma os valores', () => {
		expect(
			totalSerie([
				{ rotulo: 'a', valor: 2 },
				{ rotulo: 'b', valor: 5 }
			])
		).toBe(7);
	});
});
