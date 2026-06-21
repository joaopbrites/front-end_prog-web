<script lang="ts">
	import ListaRecurso from '$lib/components/ListaRecurso.svelte';
	import { listarAlunos, listarCursos } from '$lib/api/endpoints';
	import { indexarPorId } from '$lib/tccs/lista';

	async function carregar(busca: string) {
		const [alunos, cursos] = await Promise.all([listarAlunos(busca || undefined), listarCursos()]);
		const mapaCursos = indexarPorId(cursos);
		return alunos.map((a) => ({
			id: a.id,
			celulas: [a.nome, a.matricula, mapaCursos.get(a.curso)?.nome ?? '—']
		}));
	}
</script>

<svelte:head>
	<title>Alunos — Gestão de TCCs UFLA</title>
</svelte:head>

<ListaRecurso
	titulo="Alunos"
	descricaoBusca="Buscar por nome ou matrícula"
	colunas={['Nome', 'Matrícula', 'Curso']}
	{carregar}
	vazioMsg="Nenhum aluno cadastrado ainda."
/>
