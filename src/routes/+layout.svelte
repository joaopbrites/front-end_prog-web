<script lang="ts">
	import '$lib/styles/global.css';
	import favicon from '$lib/assets/favicon.svg';
	import logoColorida from '$lib/assets/ufla-logo-colorida.png';
	import logoNegativa from '$lib/assets/ufla-logo-negativa.png';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { estadoTema } from '$lib/theme.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	import { construirMigalhas } from '$lib/migalhas';

	let { children } = $props();

	onMount(() => estadoTema.iniciar());

	const links = [
		{ href: '/', rotulo: 'Início' },
		{ href: '/tccs', rotulo: 'TCCs' },
		{ href: '/alunos', rotulo: 'Alunos' },
		{ href: '/professores', rotulo: 'Professores' },
		{ href: '/cursos', rotulo: 'Cursos' },
		{ href: '/departamentos', rotulo: 'Departamentos' },
		{ href: '/unidades', rotulo: 'Unidades' },
		{ href: '/dashboard', rotulo: 'Dashboard' }
	];

	// page.url.pathname inclui o base path; removemos a base para as comparações
	// e para montar as migalhas (que trabalham com caminhos relativos à app).
	const caminhoAtual = $derived(page.url.pathname.slice(base.length) || '/');

	function ativo(href: string): boolean {
		return href === '/'
			? caminhoAtual === '/'
			: caminhoAtual === href || caminhoAtual.startsWith(href + '/');
	}

	const migalhas = $derived(construirMigalhas(caminhoAtual));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a class="skip-link" href="#conteudo-principal">Pular para o conteúdo principal</a>

<header class="cabecalho">
	<div class="conteudo cabecalho__inner">
		<a class="marca" href="{base}/">
			<img
				class="logo logo--claro"
				src={logoColorida}
				alt="UFLA — Universidade Federal de Lavras"
			/>
			<img
				class="logo logo--escuro"
				src={logoNegativa}
				alt="UFLA — Universidade Federal de Lavras"
			/>
			<span class="marca__sistema">Gestão de TCCs</span>
		</a>

		<div class="cabecalho__acoes">
			<nav aria-label="Navegação principal">
				<ul class="nav">
					{#each links as { href, rotulo } (href)}
						<li>
							<a href={base + href} aria-current={ativo(href) ? 'page' : undefined}>{rotulo}</a>
						</li>
					{/each}
				</ul>
			</nav>
			<ThemeToggle />
		</div>
	</div>
</header>

<main id="conteudo-principal" class="conteudo" tabindex="-1">
	{#if migalhas.length > 0}
		<nav class="migalhas" aria-label="Trilha de navegação">
			<ol>
				{#each migalhas as migalha (migalha.href)}
					<li>
						{#if migalha.atual}
							<span aria-current="page">{migalha.rotulo}</span>
						{:else}
							<a href={base + migalha.href}>{migalha.rotulo}</a>
						{/if}
					</li>
				{/each}
			</ol>
		</nav>
	{/if}
	{@render children()}
</main>

<footer class="rodape">
	<div class="conteudo">
		<p>Universidade Federal de Lavras — Sistema de Gestão de TCCs</p>
	</div>
</footer>

<Toasts />

<style>
	.cabecalho {
		background: var(--cor-cabecalho-fundo);
		color: var(--cor-cabecalho-texto);
		border-bottom: 3px solid var(--cor-primaria);
		box-shadow: var(--sombra);
	}

	.cabecalho__inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--espaco-3);
		padding-block: var(--espaco-3);
	}

	.marca {
		display: inline-flex;
		align-items: center;
		gap: var(--espaco-3);
		color: var(--cor-cabecalho-texto);
		text-decoration: none;
	}

	.marca__sistema {
		padding-left: var(--espaco-3);
		border-left: 2px solid var(--cor-borda);
		font-weight: 600;
		font-size: 1.1rem;
	}

	.cabecalho__acoes {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--espaco-3);
	}

	.nav {
		display: flex;
		flex-wrap: wrap;
		gap: var(--espaco-1);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.nav a {
		display: block;
		padding: var(--espaco-2) var(--espaco-3);
		color: var(--cor-cabecalho-texto);
		text-decoration: none;
		border-radius: var(--raio);
		border-bottom: 3px solid transparent;
	}

	.nav a:hover {
		background: var(--cor-superficie);
	}

	.nav a[aria-current='page'] {
		font-weight: 600;
		border-bottom-color: var(--cor-primaria);
	}

	.rodape {
		margin-top: var(--espaco-6);
		border-top: 1px solid var(--cor-borda);
		background: var(--cor-superficie);
		color: var(--cor-texto-suave);
		font-size: 0.875rem;
	}

	.migalhas ol {
		display: flex;
		flex-wrap: wrap;
		gap: var(--espaco-2);
		margin: 0 0 var(--espaco-4);
		padding: 0;
		list-style: none;
		font-size: 0.9rem;
	}

	.migalhas li:not(:last-child)::after {
		content: '›';
		margin-left: var(--espaco-2);
		color: var(--cor-texto-suave);
	}

	@media (max-width: 48rem) {
		.marca__sistema {
			display: none;
		}
	}
</style>
