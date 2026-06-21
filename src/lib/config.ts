/**
 * Configuração da aplicação.
 * A URL base da API vem da variável de ambiente VITE_API_BASE_URL,
 * com fallback para o servidor de desenvolvimento local do Django.
 */
export const API_BASE_URL: string =
	import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';
