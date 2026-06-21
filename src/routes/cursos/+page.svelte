<script lang="ts">
	import ListaRecurso from '$lib/components/ListaRecurso.svelte';
	import { listarCursos } from '$lib/api/endpoints';
	import { filtrarPorTexto } from '$lib/listas/filtro';

	async function carregar(busca: string) {
		const cursos = await listarCursos();
		return filtrarPorTexto(cursos, busca, (c) => [c.nome, c.sigla, c.codigo]).map((c) => ({
			id: c.id,
			celulas: [c.nome, c.sigla, c.codigo]
		}));
	}
</script>

<svelte:head>
	<title>Cursos — Gestão de TCCs UFLA</title>
</svelte:head>

<ListaRecurso
	titulo="Cursos"
	descricaoBusca="Buscar por nome, sigla ou código"
	colunas={['Nome', 'Sigla', 'Código']}
	{carregar}
	vazioMsg="Nenhum curso cadastrado ainda."
/>
