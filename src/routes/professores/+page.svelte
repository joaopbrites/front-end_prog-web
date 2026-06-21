<script lang="ts">
	import ListaRecurso from '$lib/components/ListaRecurso.svelte';
	import { listarProfessores, listarDepartamentos } from '$lib/api/endpoints';
	import { indexarPorId } from '$lib/tccs/lista';

	async function carregar(busca: string) {
		const [professores, departamentos] = await Promise.all([
			listarProfessores(busca || undefined),
			listarDepartamentos()
		]);
		const mapaDeptos = indexarPorId(departamentos);
		return professores.map((p) => ({
			id: p.id,
			celulas: [p.nome, mapaDeptos.get(p.departamento)?.sigla ?? '—']
		}));
	}
</script>

<svelte:head>
	<title>Professores — Gestão de TCCs UFLA</title>
</svelte:head>

<ListaRecurso
	titulo="Professores"
	descricaoBusca="Buscar por nome"
	colunas={['Nome', 'Departamento']}
	{carregar}
	vazioMsg="Nenhum professor cadastrado ainda."
/>
