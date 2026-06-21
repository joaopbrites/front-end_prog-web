<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	interface LinhaTabela {
		id: number | string;
		celulas: string[];
	}

	let {
		titulo,
		descricaoBusca,
		colunas,
		carregar,
		vazioMsg = 'Nenhum registro encontrado.'
	}: {
		titulo: string;
		descricaoBusca: string;
		colunas: string[];
		carregar: (busca: string) => Promise<LinhaTabela[]>;
		vazioMsg?: string;
	} = $props();

	let carregando = $state(true);
	let erro = $state(false);
	let linhas = $state<LinhaTabela[]>([]);

	const buscaAtual = $derived(page.url.searchParams.get('search') ?? '');
	let termo = $state(page.url.searchParams.get('search') ?? '');

	async function executar(busca: string) {
		carregando = true;
		erro = false;
		try {
			linhas = await carregar(busca);
		} catch {
			erro = true;
		} finally {
			carregando = false;
		}
	}

	$effect(() => {
		executar(buscaAtual);
	});

	function aoBuscar(evento: SubmitEvent) {
		evento.preventDefault();
		const query = termo.trim() ? `?search=${encodeURIComponent(termo.trim())}` : '';
		goto(`${page.url.pathname}${query}`, { keepFocus: true, noScroll: true });
	}
</script>

<h1>{titulo}</h1>

<form class="busca" role="search" onsubmit={aoBuscar}>
	<label for="busca-recurso">{descricaoBusca}</label>
	<div class="busca__campo">
		<input id="busca-recurso" type="search" bind:value={termo} />
		<button type="submit">Buscar</button>
	</div>
</form>

{#if carregando}
	<p class="estado" role="status">Carregando…</p>
{:else if erro}
	<p class="estado estado--erro" role="alert">
		Não foi possível carregar os dados. Verifique se a API está disponível e tente novamente.
	</p>
{:else if linhas.length === 0}
	<p class="estado" role="status">
		{buscaAtual ? `Nenhum resultado para “${buscaAtual}”.` : vazioMsg}
	</p>
{:else}
	<table>
		<caption>
			{linhas.length}
			{linhas.length === 1 ? 'registro' : 'registros'}{buscaAtual ? ` para “${buscaAtual}”` : ''}
		</caption>
		<thead>
			<tr>
				{#each colunas as coluna (coluna)}
					<th scope="col">{coluna}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each linhas as linha (linha.id)}
				<tr>
					{#each linha.celulas as celula, i (i)}
						<td>{celula}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
