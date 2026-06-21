<script lang="ts">
	import { estadoTema } from '$lib/theme.svelte';

	const escuro = $derived(estadoTema.atual === 'dark');
</script>

<button
	type="button"
	class="alternar-tema"
	onclick={() => estadoTema.alternar()}
	aria-pressed={escuro}
>
	<span aria-hidden="true">{escuro ? '☀️' : '🌙'}</span>
	<span>{escuro ? 'Tema claro' : 'Tema escuro'}</span>
</button>

<style>
	.alternar-tema {
		display: inline-flex;
		align-items: center;
		gap: var(--espaco-2);
		padding: var(--espaco-2) var(--espaco-3);
		background: transparent;
		color: var(--cor-cabecalho-texto);
		border: 1px solid var(--cor-borda);
		border-radius: var(--raio);
		font: inherit;
		cursor: pointer;
	}

	.alternar-tema:hover {
		background: var(--cor-superficie);
	}
</style>
