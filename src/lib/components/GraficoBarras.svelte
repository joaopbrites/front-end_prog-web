<script lang="ts">
	import type { PontoSerie } from '$lib/dashboard/series';

	let { dados }: { dados: PontoSerie[] } = $props();

	const maximo = $derived(Math.max(1, ...dados.map((d) => d.valor)));
</script>

<!-- Gráfico puramente visual; a representação acessível é a tabela ao lado (daí aria-hidden). -->
<div class="grafico" aria-hidden="true">
	<ul class="barras">
		{#each dados as ponto (ponto.rotulo)}
			<li class="barra-item">
				<span class="barra-valor">{ponto.valor}</span>
				<span class="barra-trilho">
					<span class="barra" style="height: {(ponto.valor / maximo) * 100}%"></span>
				</span>
				<span class="barra-rotulo">{ponto.rotulo}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.grafico {
		width: 100%;
	}

	.barras {
		display: flex;
		align-items: stretch;
		gap: var(--espaco-3);
		margin: 0 0 var(--espaco-2);
		padding: 0;
		list-style: none;
	}

	.barra-item {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 0;
	}

	.barra-valor {
		font-weight: 600;
		font-size: 0.85rem;
	}

	.barra-trilho {
		display: flex;
		align-items: flex-end;
		width: 100%;
		height: 12rem;
	}

	.barra {
		width: 100%;
		max-width: 5rem;
		margin: 0 auto;
		min-height: 2px;
		background: var(--cor-primaria);
		border-radius: 4px 4px 0 0;
	}

	.barra-rotulo {
		margin-top: var(--espaco-2);
		font-size: 0.85rem;
		color: var(--cor-texto-suave);
		text-align: center;
		overflow-wrap: anywhere;
	}
</style>
