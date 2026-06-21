import { describe, it, expect } from 'vitest';
import { resolverTemaInicial, proximoTema } from './theme';

describe('resolverTemaInicial', () => {
	it('usa a preferência armazenada quando válida', () => {
		expect(resolverTemaInicial('dark', false)).toBe('dark');
		expect(resolverTemaInicial('light', true)).toBe('light');
	});

	it('cai para a preferência do sistema quando não há valor armazenado', () => {
		expect(resolverTemaInicial(null, true)).toBe('dark');
		expect(resolverTemaInicial(null, false)).toBe('light');
	});

	it('ignora valores armazenados inválidos', () => {
		expect(resolverTemaInicial('roxo', true)).toBe('dark');
		expect(resolverTemaInicial('', false)).toBe('light');
	});
});

describe('proximoTema', () => {
	it('alterna entre claro e escuro', () => {
		expect(proximoTema('light')).toBe('dark');
		expect(proximoTema('dark')).toBe('light');
	});
});
