<script lang="ts">
	import { toasts } from '$lib/toast.svelte';
</script>

<div class="toasts" aria-live="polite">
	{#each toasts.lista as toast (toast.id)}
		<div class="toast toast--{toast.tipo}">
			<span>{toast.mensagem}</span>
			<button
				type="button"
				onclick={() => toasts.remover(toast.id)}
				aria-label="Fechar notificação"
			>
				×
			</button>
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		right: var(--espaco-3);
		bottom: var(--espaco-3);
		z-index: 1000;
		display: flex;
		flex-direction: column;
		gap: var(--espaco-2);
		max-width: min(90vw, 28rem);
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: var(--espaco-3);
		padding: var(--espaco-3);
		border-left: 4px solid;
		border-radius: var(--raio);
		background: var(--cor-fundo);
		color: var(--cor-texto);
		box-shadow: var(--sombra);
	}

	.toast--sucesso {
		border-left-color: var(--status-aprovado);
	}

	.toast--erro {
		border-left-color: var(--status-reprovado);
	}

	.toast button {
		flex-shrink: 0;
		padding: 0 var(--espaco-1);
		font-size: 1.25rem;
		line-height: 1;
		color: var(--cor-texto-suave);
		background: transparent;
		border: none;
		cursor: pointer;
	}
</style>
