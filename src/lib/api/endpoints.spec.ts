import { describe, it, expect, vi } from 'vitest';
import { listarTccs, listarAlunos, obterEstatisticas, alterarStatusTcc } from './endpoints';
import type { ApiClient } from './client';

function clienteFake(): ApiClient {
	return {
		get: vi.fn().mockResolvedValue([]),
		post: vi.fn().mockResolvedValue({}),
		put: vi.fn().mockResolvedValue({}),
		patch: vi.fn().mockResolvedValue({}),
		del: vi.fn().mockResolvedValue(undefined)
	} as unknown as ApiClient;
}

describe('endpoints', () => {
	it('listarTccs chama GET /tccs/ com a busca', async () => {
		const c = clienteFake();
		await listarTccs('web', c);
		expect(c.get).toHaveBeenCalledWith('/tccs/', { search: 'web' });
	});

	it('listarAlunos chama GET /alunos/', async () => {
		const c = clienteFake();
		await listarAlunos(undefined, c);
		expect(c.get).toHaveBeenCalledWith('/alunos/', { search: undefined });
	});

	it('obterEstatisticas chama GET /tccs/estatisticas/', async () => {
		const c = clienteFake();
		await obterEstatisticas(c);
		expect(c.get).toHaveBeenCalledWith('/tccs/estatisticas/');
	});

	it('alterarStatusTcc faz PATCH no TCC com o novo status', async () => {
		const c = clienteFake();
		await alterarStatusTcc(5, '2', c);
		expect(c.patch).toHaveBeenCalledWith('/tccs/5/', { status: '2' });
	});
});
