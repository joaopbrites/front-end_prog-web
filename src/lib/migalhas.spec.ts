import { describe, it, expect } from 'vitest';
import { construirMigalhas } from './migalhas';

describe('construirMigalhas', () => {
	it('retorna vazio na home', () => {
		expect(construirMigalhas('/')).toEqual([]);
	});

	it('monta a trilha de uma rota simples, marcando a atual', () => {
		expect(construirMigalhas('/tccs')).toEqual([
			{ rotulo: 'Início', href: '/', atual: false },
			{ rotulo: 'TCCs', href: '/tccs', atual: true }
		]);
	});

	it('monta a trilha de uma rota aninhada', () => {
		const trilha = construirMigalhas('/tccs/novo');
		expect(trilha.map((m) => m.rotulo)).toEqual(['Início', 'TCCs', 'Cadastrar']);
		expect(trilha.at(-1)?.atual).toBe(true);
		expect(trilha.at(-1)?.href).toBe('/tccs/novo');
	});

	it('usa o próprio segmento como rótulo quando desconhecido', () => {
		expect(construirMigalhas('/xyz').at(-1)?.rotulo).toBe('xyz');
	});
});
