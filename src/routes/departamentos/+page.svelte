<script lang="ts">
	import ListaRecurso from '$lib/components/ListaRecurso.svelte';
	import { listarDepartamentos, listarUnidades } from '$lib/api/endpoints';
	import { indexarPorId } from '$lib/tccs/lista';
	import { filtrarPorTexto } from '$lib/listas/filtro';

	async function carregar(busca: string) {
		const [departamentos, unidades] = await Promise.all([listarDepartamentos(), listarUnidades()]);
		const mapaUnidades = indexarPorId(unidades);
		return filtrarPorTexto(departamentos, busca, (d) => [d.nome, d.sigla]).map((d) => ({
			id: d.id,
			celulas: [d.nome, d.sigla, mapaUnidades.get(d.unidade_academica)?.sigla ?? '—']
		}));
	}
</script>

<svelte:head>
	<title>Departamentos — Gestão de TCCs UFLA</title>
</svelte:head>

<ListaRecurso
	titulo="Departamentos"
	descricaoBusca="Buscar por nome ou sigla"
	colunas={['Nome', 'Sigla', 'Unidade']}
	{carregar}
	vazioMsg="Nenhum departamento cadastrado ainda."
/>
