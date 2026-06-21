<script lang="ts">
	import { onMount } from 'svelte';
	import { obterEstatisticas } from '$lib/api/endpoints';
	import type { Estatisticas } from '$lib/api/types';
	import { objetoParaSeries, ordenarPorValor } from '$lib/dashboard/series';
	import GraficoBarras from '$lib/components/GraficoBarras.svelte';
	import TabelaSerie from '$lib/components/TabelaSerie.svelte';

	let carregando = $state(true);
	let erro = $state(false);
	let est = $state<Estatisticas | null>(null);

	onMount(async () => {
		try {
			est = await obterEstatisticas();
		} catch {
			erro = true;
		} finally {
			carregando = false;
		}
	});

	const statusSeries = $derived(est ? objetoParaSeries(est.por_status) : []);
	const tipoSeries = $derived(est ? objetoParaSeries(est.por_tipo) : []);

	const tabelasSecundarias = $derived(
		est
			? [
					{ titulo: 'Por idioma', rotulo: 'Idioma', series: objetoParaSeries(est.por_idioma) },
					{
						titulo: 'Por semestre de defesa',
						rotulo: 'Semestre',
						series: objetoParaSeries(est.por_semestre)
					},
					{
						titulo: 'Por curso',
						rotulo: 'Curso',
						series: ordenarPorValor(objetoParaSeries(est.por_curso))
					},
					{
						titulo: 'Por departamento',
						rotulo: 'Departamento',
						series: ordenarPorValor(objetoParaSeries(est.por_departamento))
					},
					{
						titulo: 'Por unidade acadêmica',
						rotulo: 'Unidade',
						series: ordenarPorValor(objetoParaSeries(est.por_unidade_academica))
					},
					{
						titulo: 'Por orientador',
						rotulo: 'Orientador',
						series: ordenarPorValor(objetoParaSeries(est.por_orientador))
					}
				]
			: []
	);
</script>

<svelte:head>
	<title>Dashboard — Gestão de TCCs UFLA</title>
</svelte:head>

<h1>Dashboard de TCCs</h1>

{#if carregando}
	<p class="estado" role="status">Carregando estatísticas…</p>
{:else if erro}
	<p class="estado estado--erro" role="alert">
		Não foi possível carregar as estatísticas. Verifique se a API está disponível e tente novamente.
	</p>
{:else if est}
	<p class="kpi">
		<span class="kpi__valor">{est.total_geral}</span>
		<span>TCCs no total</span>
	</p>

	<section aria-labelledby="sec-status">
		<h2 id="sec-status">Por status</h2>
		<GraficoBarras dados={statusSeries} />
		<TabelaSerie series={statusSeries} rotuloColuna="Status" legenda="TCCs por status" />
	</section>

	<section aria-labelledby="sec-tipo">
		<h2 id="sec-tipo">Por tipo</h2>
		<GraficoBarras dados={tipoSeries} />
		<TabelaSerie series={tipoSeries} rotuloColuna="Tipo" legenda="TCCs por tipo" />
	</section>

	<div class="grade-tabelas">
		{#each tabelasSecundarias as tabela, i (tabela.titulo)}
			<section aria-labelledby={`sec-tab-${i}`}>
				<h2 id={`sec-tab-${i}`}>{tabela.titulo}</h2>
				<TabelaSerie series={tabela.series} rotuloColuna={tabela.rotulo} legenda={tabela.titulo} />
			</section>
		{/each}
	</div>
{/if}

<style>
	.kpi {
		display: flex;
		align-items: baseline;
		gap: var(--espaco-2);
		margin-bottom: var(--espaco-5);
	}

	.kpi__valor {
		font-size: 3rem;
		font-weight: 700;
		color: var(--cor-primaria-escura);
	}

	section {
		margin-bottom: var(--espaco-5);
	}

	.grade-tabelas {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
		gap: var(--espaco-4);
	}

	.grade-tabelas section {
		margin-bottom: 0;
	}
</style>
