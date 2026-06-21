<script lang="ts">
	let {
		aberto = $bindable(false),
		titulo,
		mensagem,
		rotuloConfirmar = 'Confirmar',
		rotuloCancelar = 'Cancelar',
		perigoso = false,
		onconfirmar
	}: {
		aberto?: boolean;
		titulo: string;
		mensagem: string;
		rotuloConfirmar?: string;
		rotuloCancelar?: string;
		perigoso?: boolean;
		onconfirmar: () => void;
	} = $props();

	let dialogo = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialogo) return;
		if (aberto && !dialogo.open) {
			// showModal dá focus trap, Esc e retorno de foco ao gatilho nativamente.
			dialogo.showModal();
		} else if (!aberto && dialogo.open) {
			dialogo.close();
		}
	});

	function fechar() {
		aberto = false;
	}

	function confirmar() {
		onconfirmar();
		aberto = false;
	}
</script>

<dialog bind:this={dialogo} aria-labelledby="dialogo-titulo" onclose={fechar}>
	<h2 id="dialogo-titulo">{titulo}</h2>
	<p>{mensagem}</p>
	<div class="dialogo__acoes">
		<button type="button" class="cancelar" onclick={fechar}>{rotuloCancelar}</button>
		<button type="button" class="confirmar" class:perigoso onclick={confirmar}>
			{rotuloConfirmar}
		</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: min(90vw, 32rem);
		padding: var(--espaco-4);
		color: var(--cor-texto);
		background: var(--cor-fundo);
		border: 1px solid var(--cor-borda);
		border-radius: var(--raio);
		box-shadow: var(--sombra);
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}

	dialog h2 {
		margin-top: 0;
	}

	.dialogo__acoes {
		display: flex;
		justify-content: flex-end;
		gap: var(--espaco-3);
		margin-top: var(--espaco-4);
	}

	.dialogo__acoes button {
		padding: var(--espaco-2) var(--espaco-4);
		font: inherit;
		font-weight: 600;
		border-radius: var(--raio);
		cursor: pointer;
	}

	.cancelar {
		color: var(--cor-texto);
		background: var(--cor-superficie);
		border: 1px solid var(--cor-borda);
	}

	.confirmar {
		color: #fff;
		background: var(--cor-primaria-escura);
		border: 1px solid transparent;
	}

	.confirmar.perigoso {
		background: var(--status-reprovado);
	}
</style>
