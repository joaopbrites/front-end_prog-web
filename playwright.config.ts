import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	testMatch: '**/*.e2e.{ts,js}',
	// Compatibilidade de navegadores (RNF de baixa prioridade) — Playwright nativo.
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }
		// WebKit exige libs de sistema do host (instale com `npx playwright install-deps webkit`,
		// requer root). Habilite quando disponível:
		// { name: 'webkit', use: { ...devices['Desktop Safari'] } }
	]
});
