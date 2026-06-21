import { describe, it, expect } from 'vitest';
import { criarToast } from './toast';

describe('criarToast', () => {
	it('cria um toast com id, mensagem e tipo', () => {
		expect(criarToast(1, 'Salvo!', 'sucesso')).toEqual({
			id: 1,
			mensagem: 'Salvo!',
			tipo: 'sucesso'
		});
	});
});
