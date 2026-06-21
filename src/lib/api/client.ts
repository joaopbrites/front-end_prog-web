import { API_BASE_URL } from '$lib/config';

/** Erro lançado quando a API responde com status fora da faixa 2xx. */
export class ApiError extends Error {
	readonly status: number;
	readonly body: unknown;

	constructor(status: number, body: unknown, message?: string) {
		super(message ?? `Erro ${status} na requisição à API`);
		this.name = 'ApiError';
		this.status = status;
		this.body = body;
	}
}

type QueryValue = string | number | boolean | undefined | null;
export type Query = Record<string, QueryValue>;

export interface ApiClient {
	get<T>(path: string, query?: Query): Promise<T>;
	post<T>(path: string, body?: unknown): Promise<T>;
	put<T>(path: string, body?: unknown): Promise<T>;
	patch<T>(path: string, body?: unknown): Promise<T>;
	del(path: string): Promise<void>;
}

/** Monta a URL absoluta a partir da base, do caminho e de parâmetros de query. */
export function buildUrl(baseUrl: string, path: string, query?: Query): string {
	const base = baseUrl.replace(/\/+$/, '');
	const caminho = path.startsWith('/') ? path : `/${path}`;
	const url = new URL(base + caminho);
	if (query) {
		for (const [chave, valor] of Object.entries(query)) {
			if (valor !== undefined && valor !== null && valor !== '') {
				url.searchParams.set(chave, String(valor));
			}
		}
	}
	return url.toString();
}

async function request<T>(
	fetchFn: typeof fetch,
	method: string,
	url: string,
	body?: unknown
): Promise<T> {
	const init: RequestInit = { method };

	if (body !== undefined) {
		if (body instanceof FormData) {
			// Não definir Content-Type: o navegador adiciona o boundary correto.
			init.body = body;
		} else {
			init.headers = { 'Content-Type': 'application/json' };
			init.body = JSON.stringify(body);
		}
	}

	const res = await fetchFn(url, init);

	if (!res.ok) {
		let corpo: unknown = null;
		try {
			corpo = await res.json();
		} catch {
			// resposta sem corpo JSON
		}
		throw new ApiError(res.status, corpo);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	const texto = await res.text();
	return (texto ? JSON.parse(texto) : undefined) as T;
}

/** Cria um cliente da API. `fetchFn` é injetável (testes e SSR do SvelteKit). */
export function createApiClient(
	baseUrl: string = API_BASE_URL,
	fetchFn: typeof fetch = fetch
): ApiClient {
	return {
		get<T>(path: string, query?: Query) {
			return request<T>(fetchFn, 'GET', buildUrl(baseUrl, path, query));
		},
		post<T>(path: string, body?: unknown) {
			return request<T>(fetchFn, 'POST', buildUrl(baseUrl, path), body);
		},
		put<T>(path: string, body?: unknown) {
			return request<T>(fetchFn, 'PUT', buildUrl(baseUrl, path), body);
		},
		patch<T>(path: string, body?: unknown) {
			return request<T>(fetchFn, 'PATCH', buildUrl(baseUrl, path), body);
		},
		del(path: string) {
			return request<void>(fetchFn, 'DELETE', buildUrl(baseUrl, path));
		}
	};
}

/** Cliente padrão, usando a URL base da configuração e o fetch global. */
export const api: ApiClient = createApiClient();
