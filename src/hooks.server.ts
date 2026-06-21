import type { Handle } from '@sveltejs/kit';

/**
 * Adiciona cabeçalhos de segurança a todas as respostas (RNF de segurança básica).
 * Sem login/sessão no escopo, mas estas defesas são baratas e recomendadas.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
	return response;
};
