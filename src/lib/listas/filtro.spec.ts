import { describe, it, expect } from 'vitest';
import { normalizar, filtrarPorTexto } from './filtro';

describe('normalizar', () => {
	it('remove acentos e baixa a caixa', () => {
		expect(normalizar('Ciência')).toBe('ciencia');
		expect(normalizar('  ÁÉÍÓÚ  ')).toBe('aeiou');
	});
});

describe('filtrarPorTexto', () => {
	const itens = [{ nome: 'Ciência da Computação' }, { nome: 'Matemática' }];
	const campos = (i: { nome: string }) => [i.nome];

	it('retorna todos quando o termo é vazio', () => {
		expect(filtrarPorTexto(itens, '', campos)).toHaveLength(2);
	});

	it('filtra ignorando acentos e caixa', () => {
		expect(filtrarPorTexto(itens, 'ciencia', campos)).toEqual([{ nome: 'Ciência da Computação' }]);
		expect(filtrarPorTexto(itens, 'MATEMATICA', campos)).toEqual([{ nome: 'Matemática' }]);
	});

	it('retorna vazio quando nada casa', () => {
		expect(filtrarPorTexto(itens, 'xyz', campos)).toEqual([]);
	});
});
