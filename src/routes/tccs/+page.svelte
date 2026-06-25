<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import {
		listarTccs,
		listarAlunos,
		listarProfessores,
		alterarStatusTcc,
		excluirTcc
	} from '$lib/api/endpoints';
	import {
		montarLinhasTcc,
		atualizarStatusLinha,
		removerLinhaTcc,
		ordenarLinhas,
		filtrarLinhasPorStatus,
		type LinhaTcc,
		type ColunaOrdenavel,
		type Direcao
	} from '$lib/tccs/lista';
	import { STATUS_OPCOES } from '$lib/tccs/opcoes';
	import type { Status } from '$lib/api/types';
	import { toasts } from '$lib/toast.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import DialogoConfirmacao from '$lib/components/DialogoConfirmacao.svelte';

	let carregando = $state(true);
	let erro = $state(false);
	let linhas = $state<LinhaTcc[]>([]);
	const alterando = new SvelteSet<number>();
	let ordenacao = $state<{ coluna: ColunaOrdenavel; direcao: Direcao }>({
		coluna: 'titulo',
		direcao: 'asc'
	});

	let dialogoExcluir = $state(false);
	let tccParaExcluir = $state<LinhaTcc | null>(null);

	const buscaAtual = $derived(page.url.searchParams.get('search') ?? '');
	const statusFiltro = $derived(page.url.searchParams.get('status') ?? '');
	let termo = $state(page.url.searchParams.get('search') ?? '');

	const linhasVisiveis = $derived(
		ordenarLinhas(filtrarLinhasPorStatus(linhas, statusFiltro), ordenacao.coluna, ordenacao.direcao)
	);

	async function carregar(busca: string) {
		carregando = true;
		erro = false;
		try {
			const [tccs, alunos, professores] = await Promise.all([
				listarTccs(busca || undefined),
				listarAlunos(),
				listarProfessores()
			]);
			linhas = montarLinhasTcc(tccs, alunos, professores);
		} catch {
			erro = true;
		} finally {
			carregando = false;
		}
	}

	$effect(() => {
		carregar(buscaAtual);
	});

	function atualizarUrl(novoSearch: string, novoStatus: string) {
		const partes: string[] = [];
		if (novoSearch.trim()) partes.push(`search=${encodeURIComponent(novoSearch.trim())}`);
		if (novoStatus) partes.push(`status=${encodeURIComponent(novoStatus)}`);
		const query = partes.length ? `?${partes.join('&')}` : '';
		goto(`${base}/tccs${query}`, { keepFocus: true, noScroll: true });
	}

	function aoBuscar(evento: SubmitEvent) {
		evento.preventDefault();
		atualizarUrl(termo, statusFiltro);
	}

	function ordenarPor(coluna: ColunaOrdenavel) {
		ordenacao =
			ordenacao.coluna === coluna
				? { coluna, direcao: ordenacao.direcao === 'asc' ? 'desc' : 'asc' }
				: { coluna, direcao: 'asc' };
	}

	function ariaSort(coluna: ColunaOrdenavel): 'ascending' | 'descending' | 'none' {
		if (ordenacao.coluna !== coluna) return 'none';
		return ordenacao.direcao === 'asc' ? 'ascending' : 'descending';
	}

	function seta(coluna: ColunaOrdenavel): string {
		if (ordenacao.coluna !== coluna) return '↕';
		return ordenacao.direcao === 'asc' ? '▲' : '▼';
	}

	function marcarAlterando(id: number, ativo: boolean) {
		if (ativo) alterando.add(id);
		else alterando.delete(id);
	}

	async function mudarStatus(linha: LinhaTcc, novo: Status) {
		if (novo === linha.status) return;
		marcarAlterando(linha.id, true);
		try {
			const atualizado = await alterarStatusTcc(linha.id, novo);
			linhas = atualizarStatusLinha(linhas, linha.id, atualizado.status, atualizado.status_display);
			toasts.mostrar(`Status de “${linha.titulo}” atualizado para ${atualizado.status_display}.`);
		} catch {
			toasts.mostrar(`Não foi possível alterar o status de “${linha.titulo}”.`, 'erro');
			await carregar(buscaAtual);
		} finally {
			marcarAlterando(linha.id, false);
		}
	}

	function pedirExclusao(linha: LinhaTcc) {
		tccParaExcluir = linha;
		dialogoExcluir = true;
	}

	async function confirmarExclusao() {
		const alvo = tccParaExcluir;
		if (!alvo) return;
		try {
			await excluirTcc(alvo.id);
			linhas = removerLinhaTcc(linhas, alvo.id);
			toasts.mostrar(`TCC “${alvo.titulo}” excluído.`);
		} catch {
			toasts.mostrar(`Não foi possível excluir “${alvo.titulo}”.`, 'erro');
		} finally {
			tccParaExcluir = null;
		}
	}

	const colunasOrdenaveis: { coluna: ColunaOrdenavel; rotulo: string }[] = [
		{ coluna: 'titulo', rotulo: 'Título' },
		{ coluna: 'aluno', rotulo: 'Aluno' },
		{ coluna: 'orientador', rotulo: 'Orientador' },
		{ coluna: 'statusDisplay', rotulo: 'Status' }
	];
</script>

<svelte:head>
	<title>TCCs — Gestão de TCCs UFLA</title>
</svelte:head>

<div class="topo">
	<h1>Trabalhos de Conclusão de Curso</h1>
	<a class="botao-acao" href="{base}/tccs/novo">Cadastrar TCC</a>
</div>

<div class="filtros">
	<form class="busca" role="search" onsubmit={aoBuscar}>
		<label for="busca-tcc">Buscar por título ou resumo</label>
		<div class="busca__campo">
			<input id="busca-tcc" type="search" bind:value={termo} placeholder="Ex.: machine learning" />
			<button type="submit">Buscar</button>
		</div>
	</form>

	<div class="campo filtro-status">
		<label for="filtro-status">Filtrar por status</label>
		<select
			id="filtro-status"
			value={statusFiltro}
			onchange={(e) => atualizarUrl(buscaAtual, e.currentTarget.value)}
		>
			<option value="">Todos</option>
			{#each STATUS_OPCOES as opcao (opcao.valor)}
				<option value={opcao.valor}>{opcao.rotulo}</option>
			{/each}
		</select>
	</div>
</div>

{#if carregando}
	<p class="estado" role="status">Carregando TCCs…</p>
{:else if erro}
	<p class="estado estado--erro" role="alert">
		Não foi possível carregar os TCCs. Verifique se a API está disponível e tente novamente.
	</p>
{:else if linhasVisiveis.length === 0}
	<p class="estado" role="status">
		{linhas.length === 0
			? buscaAtual
				? `Nenhum TCC encontrado para “${buscaAtual}”.`
				: 'Nenhum TCC cadastrado ainda.'
			: 'Nenhum TCC corresponde aos filtros aplicados.'}
	</p>
{:else}
	<div class="tabela-scroll">
		<table>
			<caption>
				{linhasVisiveis.length}
				{linhasVisiveis.length === 1 ? 'TCC' : 'TCCs'}
			</caption>
			<thead>
				<tr>
					{#each colunasOrdenaveis as col (col.coluna)}
						<th scope="col" aria-sort={ariaSort(col.coluna)}>
							<button type="button" class="ordenavel" onclick={() => ordenarPor(col.coluna)}>
								{col.rotulo}
								<span aria-hidden="true">{seta(col.coluna)}</span>
							</button>
						</th>
					{/each}
					<th scope="col">Alterar status</th>
					<th scope="col">Tipo</th>
					<th scope="col">Arquivo</th>
					<th scope="col">Ações</th>
				</tr>
			</thead>
			<tbody>
				{#each linhasVisiveis as linha (linha.id)}
					<tr>
						<td>{linha.titulo}</td>
						<td>{linha.aluno}</td>
						<td>{linha.orientador}</td>
						<td><StatusBadge status={linha.status} rotulo={linha.statusDisplay} /></td>
						<td>
							<label class="sr-only" for={`status-${linha.id}`}>
								Alterar status de {linha.titulo}
							</label>
							<select
								id={`status-${linha.id}`}
								value={linha.status}
								disabled={alterando.has(linha.id)}
								onchange={(e) => mudarStatus(linha, e.currentTarget.value as Status)}
							>
								{#each STATUS_OPCOES as opcao (opcao.valor)}
									<option value={opcao.valor}>{opcao.rotulo}</option>
								{/each}
							</select>
						</td>
						<td>{linha.tipoDisplay}</td>
						<td>
							{#if linha.arquivo}
								<a href={linha.arquivo} target="_blank" rel="noopener">
									Baixar PDF<span class="sr-only"> de {linha.titulo}</span>
								</a>
							{:else}
								<span aria-hidden="true">—</span><span class="sr-only">Sem arquivo</span>
							{/if}
						</td>
						<td>
							<button type="button" class="botao-perigo" onclick={() => pedirExclusao(linha)}>
								Excluir<span class="sr-only"> {linha.titulo}</span>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<DialogoConfirmacao
	bind:aberto={dialogoExcluir}
	titulo="Excluir TCC"
	mensagem={tccParaExcluir
		? `Tem certeza que deseja excluir “${tccParaExcluir.titulo}”? Esta ação não pode ser desfeita.`
		: ''}
	rotuloConfirmar="Excluir"
	perigoso
	onconfirmar={confirmarExclusao}
/>

<style>
	.filtros {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: var(--espaco-4);
	}

	.filtros .busca {
		flex: 1 1 22rem;
	}

	.filtro-status {
		flex: 0 1 16rem;
	}
</style>
