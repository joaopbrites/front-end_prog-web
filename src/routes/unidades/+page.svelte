<script lang="ts">
	import ListaRecurso from '$lib/components/ListaRecurso.svelte';
	import { listarUnidades } from '$lib/api/endpoints';
	import { filtrarPorTexto } from '$lib/listas/filtro';

	async function carregar(busca: string) {
		const unidades = await listarUnidades();
		return filtrarPorTexto(unidades, busca, (u) => [u.nome, u.sigla]).map((u) => ({
			id: u.id,
			celulas: [u.nome, u.sigla]
		}));
	}
</script>

<svelte:head>
	<title>Unidades Acadêmicas — Gestão de TCCs UFLA</title>
</svelte:head>

<ListaRecurso
	titulo="Unidades Acadêmicas"
	descricaoBusca="Buscar por nome ou sigla"
	colunas={['Nome', 'Sigla']}
	{carregar}
	vazioMsg="Nenhuma unidade cadastrada ainda."
/>
