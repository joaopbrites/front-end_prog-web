import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

// Alvo do build:
//   - padrão            → adapter-node  (dev local, Docker/compose, testes E2E)
//   - ADAPTER=static    → site estático (deploy no GitHub Pages, feito pelo CI)
const usarStatic = process.env.ADAPTER === 'static';

// O `base` do SvelteKit precisa ser '' ou começar com '/'.
const basePath = (process.env.BASE_PATH ?? '') as '' | `/${string}`;

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-node serve a app (SSR) em dev/Docker; adapter-static gera
			// HTML pré-renderizado + fallback SPA (404.html) para o GitHub Pages.
			adapter: usarStatic ? adapterStatic({ fallback: '404.html' }) : adapterNode(),

			// No GitHub Pages o site fica em https://<user>.github.io/<repo>/ → base path.
			// Em dev/Docker BASE_PATH não é definido, então a base é a raiz ('').
			// relative: false → assets referenciados com caminho absoluto + base,
			// resolvendo sempre certo no Pages (inclusive em URLs com barra final).
			paths: { base: basePath, relative: false },

			// Não derruba o build por link externo (ex.: API) durante a pré-renderização.
			prerender: { handleHttpError: 'warn' }
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
