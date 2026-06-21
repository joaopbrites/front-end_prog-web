<script lang="ts">
	import type { PontoSerie } from '$lib/dashboard/series';

	let {
		series,
		rotuloColuna = 'Categoria',
		legenda
	}: {
		series: PontoSerie[];
		rotuloColuna?: string;
		legenda?: string;
	} = $props();
</script>

<table>
	{#if legenda}
		<caption>{legenda}</caption>
	{/if}
	<thead>
		<tr>
			<th scope="col">{rotuloColuna}</th>
			<th scope="col">Quantidade</th>
		</tr>
	</thead>
	<tbody>
		{#each series as ponto (ponto.rotulo)}
			<tr>
				<th scope="row">{ponto.rotulo}</th>
				<td>{ponto.valor}</td>
			</tr>
		{/each}
	</tbody>
</table>
