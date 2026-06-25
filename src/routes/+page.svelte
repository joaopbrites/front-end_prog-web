<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Início — Gestão de TCCs UFLA</title>
</svelte:head>

<section class="hero">
	<h1>Sistema de Gestão de TCCs</h1>
	<p>
		Plataforma da Universidade Federal de Lavras para consulta, cadastro e acompanhamento de
		Trabalhos de Conclusão de Curso.
	</p>
</section>

<section aria-labelledby="atalhos-titulo">
	<h2 id="atalhos-titulo">Atalhos</h2>
	<ul class="atalhos">
		<li>
			<a href="{base}/tccs">
				<strong>Ver TCCs</strong>
				<span>Listagem, busca, alteração de status e exclusão.</span>
			</a>
		</li>
		<li>
			<a href="{base}/tccs/novo">
				<strong>Cadastrar TCC</strong>
				<span>Registre um novo trabalho, com upload opcional do PDF.</span>
			</a>
		</li>
		<li>
			<a href="{base}/dashboard">
				<strong>Dashboard</strong>
				<span>Estatísticas e gráficos sobre os TCCs cadastrados.</span>
			</a>
		</li>
	</ul>
</section>

<section aria-labelledby="comousar-titulo">
	<h2 id="comousar-titulo">Como cadastrar um TCC</h2>
	<ol class="passos">
		<li>Acesse <a href="{base}/tccs/novo">Cadastrar TCC</a>.</li>
		<li>Preencha os dados do trabalho: título, resumo, palavras-chave, tipo e idioma.</li>
		<li>Selecione o aluno, o orientador e os três membros da banca.</li>
		<li>Opcionalmente, anexe o PDF (até 10 MB) e informe o semestre de defesa.</li>
		<li>
			Confirme em <strong>Cadastrar TCC</strong>. Depois, ajuste o status pela listagem quando
			necessário.
		</li>
	</ol>
</section>

<section aria-labelledby="sobre-titulo">
	<h2 id="sobre-titulo">Sobre</h2>
	<p>
		A Universidade Federal de Lavras (UFLA) é uma instituição pública federal de ensino superior
		localizada em Lavras, Minas Gerais. Este sistema apoia a organização dos Trabalhos de Conclusão
		de Curso das suas unidades acadêmicas.
	</p>
</section>

<style>
	.hero {
		margin-bottom: var(--espaco-5);
	}

	.hero p {
		max-width: 50rem;
		font-size: 1.1rem;
		color: var(--cor-texto-suave);
	}

	section {
		margin-bottom: var(--espaco-5);
	}

	.atalhos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: var(--espaco-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.atalhos a {
		display: block;
		height: 100%;
		padding: var(--espaco-4);
		color: var(--cor-texto);
		text-decoration: none;
		background: var(--cor-superficie);
		border: 1px solid var(--cor-borda);
		border-left: 4px solid var(--cor-primaria);
		border-radius: var(--raio);
	}

	.atalhos a:hover {
		border-color: var(--cor-primaria);
	}

	.atalhos strong {
		display: block;
		margin-bottom: var(--espaco-1);
		color: var(--cor-primaria-escura);
		font-size: 1.1rem;
	}

	.atalhos span {
		color: var(--cor-texto-suave);
	}

	.passos {
		max-width: 50rem;
		line-height: 1.7;
	}
</style>
