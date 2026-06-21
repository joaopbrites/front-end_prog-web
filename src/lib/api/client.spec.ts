import { describe, it, expect, vi } from 'vitest';
import { buildUrl, createApiClient } from './client';

function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

describe('buildUrl', () => {
	it('junta base e caminho', () => {
		expect(buildUrl('http://api.test/api', '/tccs/')).toBe('http://api.test/api/tccs/');
	});

	it('normaliza barra final duplicada da base', () => {
		expect(buildUrl('http://api.test/api/', '/tccs/')).toBe('http://api.test/api/tccs/');
	});

	it('adiciona parâmetros de query', () => {
		expect(buildUrl('http://api.test/api', '/alunos/', { search: 'ana' })).toBe(
			'http://api.test/api/alunos/?search=ana'
		);
	});

	it('ignora valores vazios, nulos ou indefinidos na query', () => {
		expect(buildUrl('http://api.test/api', '/alunos/', { search: '', page: undefined })).toBe(
			'http://api.test/api/alunos/'
		);
	});
});

describe('createApiClient', () => {
	it('get faz GET na URL montada e retorna JSON', async () => {
		const fetchFn = vi.fn().mockResolvedValue(jsonResponse([{ id: 1 }]));
		const api = createApiClient('http://api.test/api', fetchFn);
		const dados = await api.get<{ id: number }[]>('/cursos/');
		expect(fetchFn).toHaveBeenCalledWith('http://api.test/api/cursos/', { method: 'GET' });
		expect(dados).toEqual([{ id: 1 }]);
	});

	it('get repassa query como ?search=', async () => {
		const fetchFn = vi.fn().mockResolvedValue(jsonResponse([]));
		const api = createApiClient('http://api.test/api', fetchFn);
		await api.get('/alunos/', { search: 'maria' });
		expect(fetchFn).toHaveBeenCalledWith('http://api.test/api/alunos/?search=maria', {
			method: 'GET'
		});
	});

	it('post envia JSON com Content-Type application/json', async () => {
		const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ id: 9 }, 201));
		const api = createApiClient('http://api.test/api', fetchFn);
		const res = await api.post<{ id: number }>('/tccs/', { titulo: 'X' });
		expect(fetchFn).toHaveBeenCalledWith('http://api.test/api/tccs/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ titulo: 'X' })
		});
		expect(res).toEqual({ id: 9 });
	});

	it('post com FormData não define Content-Type (deixa o navegador definir)', async () => {
		const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ id: 10 }, 201));
		const api = createApiClient('http://api.test/api', fetchFn);
		const fd = new FormData();
		fd.append('titulo', 'Y');
		await api.post('/tccs/', fd);
		const [, init] = fetchFn.mock.calls[0];
		expect(init.method).toBe('POST');
		expect(init.body).toBe(fd);
		expect(init.headers).toBeUndefined();
	});

	it('patch envia PATCH com JSON', async () => {
		const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ id: 1, status: '2' }));
		const api = createApiClient('http://api.test/api', fetchFn);
		await api.patch('/tccs/1/', { status: '2' });
		expect(fetchFn).toHaveBeenCalledWith('http://api.test/api/tccs/1/', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: '2' })
		});
	});

	it('del faz DELETE e resolve quando 204', async () => {
		const fetchFn = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
		const api = createApiClient('http://api.test/api', fetchFn);
		await expect(api.del('/tccs/1/')).resolves.toBeUndefined();
		expect(fetchFn).toHaveBeenCalledWith('http://api.test/api/tccs/1/', { method: 'DELETE' });
	});

	it('lança ApiError com status e corpo em resposta não-ok', async () => {
		const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ titulo: ['Obrigatório'] }, 400));
		const api = createApiClient('http://api.test/api', fetchFn);
		await expect(api.post('/tccs/', {})).rejects.toMatchObject({
			name: 'ApiError',
			status: 400,
			body: { titulo: ['Obrigatório'] }
		});
	});
});
