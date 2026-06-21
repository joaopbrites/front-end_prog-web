<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { listarAlunos, listarProfessores, criarTcc } from '$lib/api/endpoints';
	import { ApiError } from '$lib/api/client';
	import type { Aluno, Professor } from '$lib/api/types';
	import {
		valoresIniciais,
		validarFormularioTcc,
		validarArquivoPdf,
		montarFormDataTcc,
		ROTULOS_CAMPOS,
		type ValoresTcc,
		type ErrosTcc
	} from '$lib/tccs/formulario';
	import { TIPOS, IDIOMAS, SEMESTRES } from '$lib/tccs/opcoes';
	import CampoTexto from '$lib/components/CampoTexto.svelte';
	import CampoSelect from '$lib/components/CampoSelect.svelte';

	let valores = $state<ValoresTcc>(valoresIniciais());
	let arquivo = $state<File | null>(null);
	let erros = $state<ErrosTcc>({});
	let erroArquivo = $state<string | null>(null);
	let tentouEnviar = $state(false);
	let enviando = $state(false);
	let erroEnvio = $state<string | null>(null);

	let alunos = $state<Aluno[]>([]);
	let professores = $state<Professor[]>([]);
	let carregandoOpcoes = $state(true);
	let erroOpcoes = $state(false);

	let resumoEl = $state<HTMLDivElement | null>(null);

	const alunosOpcoes = $derived(
		alunos.map((a) => ({ valor: String(a.id), rotulo: `${a.nome} (${a.matricula})` }))
	);
	const professoresOpcoes = $derived(
		professores.map((p) => ({ valor: String(p.id), rotulo: p.nome }))
	);
	const tiposOpcoes = TIPOS.map((t) => ({ valor: t.valor, rotulo: t.rotulo }));
	const idiomasOpcoes = IDIOMAS.map((i) => ({ valor: i.valor, rotulo: i.rotulo }));
	const semestresOpcoes = SEMESTRES.map((s) => ({ valor: s, rotulo: s }));

	const totalErros = $derived(Object.keys(erros).length + (erroArquivo ? 1 : 0));

	onMount(async () => {
		try {
			[alunos, professores] = await Promise.all([listarAlunos(), listarProfessores()]);
		} catch {
			erroOpcoes = true;
		} finally {
			carregandoOpcoes = false;
		}
	});

	function aoSelecionarArquivo(evento: Event) {
		const input = evento.currentTarget as HTMLInputElement;
		arquivo = input.files?.[0] ?? null;
		erroArquivo = validarArquivoPdf(arquivo);
	}

	function aplicarErrosApi(corpo: unknown) {
		if (corpo && typeof corpo === 'object') {
			const novos: ErrosTcc = {};
			for (const [campo, msgs] of Object.entries(corpo as Record<string, unknown>)) {
				if (campo in valores) {
					novos[campo as keyof ValoresTcc] = Array.isArray(msgs) ? String(msgs[0]) : String(msgs);
				}
			}
			erros = { ...erros, ...novos };
		}
	}

	async function aoEnviar(evento: SubmitEvent) {
		evento.preventDefault();
		tentouEnviar = true;
		erroEnvio = null;
		erros = validarFormularioTcc(valores);
		erroArquivo = validarArquivoPdf(arquivo);

		if (totalErros > 0) {
			await tick();
			resumoEl?.focus();
			return;
		}

		enviando = true;
		try {
			await criarTcc(montarFormDataTcc(valores, arquivo));
			await goto('/tccs');
		} catch (e) {
			if (e instanceof ApiError) {
				aplicarErrosApi(e.body);
				erroEnvio =
					'Não foi possível cadastrar o TCC. Verifique os campos destacados e tente novamente.';
			} else {
				erroEnvio = 'Erro inesperado ao cadastrar o TCC. Tente novamente.';
			}
			await tick();
			resumoEl?.focus();
		} finally {
			enviando = false;
		}
	}
</script>

<svelte:head>
	<title>Cadastrar TCC — Gestão de TCCs UFLA</title>
</svelte:head>

<h1>Cadastrar TCC</h1>
<p>Campos marcados com <span class="obrigatorio">*</span> são obrigatórios.</p>

{#if carregandoOpcoes}
	<p class="estado" role="status">Carregando formulário…</p>
{:else if erroOpcoes}
	<p class="estado estado--erro" role="alert">
		Não foi possível carregar os dados necessários (alunos e professores). Verifique se a API está
		disponível e recarregue a página.
	</p>
{:else}
	{#if tentouEnviar && totalErros > 0}
		<div class="resumo-erros" role="alert" tabindex="-1" bind:this={resumoEl}>
			<h2>
				{totalErros}
				{totalErros === 1 ? 'campo precisa ser corrigido' : 'campos precisam ser corrigidos'}
			</h2>
			<ul>
				{#each Object.entries(erros) as [campo, msg] (campo)}
					<li><a href={`#${campo}`}>{ROTULOS_CAMPOS[campo as keyof ValoresTcc]}: {msg}</a></li>
				{/each}
				{#if erroArquivo}
					<li><a href="#arquivo">Arquivo: {erroArquivo}</a></li>
				{/if}
			</ul>
		</div>
	{/if}

	{#if erroEnvio}
		<p class="estado estado--erro" role="alert">{erroEnvio}</p>
	{/if}

	<form onsubmit={aoEnviar} novalidate>
		<fieldset>
			<legend>Dados do trabalho</legend>
			<CampoTexto
				id="titulo"
				rotulo="Título"
				bind:value={valores.titulo}
				obrigatorio
				erro={erros.titulo ?? ''}
			/>
			<CampoTexto
				id="resumo"
				rotulo="Resumo"
				tipo="textarea"
				bind:value={valores.resumo}
				obrigatorio
				erro={erros.resumo ?? ''}
			/>
			<CampoTexto
				id="palavras_chave"
				rotulo="Palavras-chave"
				bind:value={valores.palavras_chave}
				obrigatorio
				erro={erros.palavras_chave ?? ''}
			/>
			<CampoSelect
				id="tipo"
				rotulo="Tipo"
				opcoes={tiposOpcoes}
				bind:value={valores.tipo}
				obrigatorio
				erro={erros.tipo ?? ''}
			/>
			<CampoSelect
				id="idioma"
				rotulo="Idioma"
				opcoes={idiomasOpcoes}
				bind:value={valores.idioma}
				obrigatorio
				erro={erros.idioma ?? ''}
			/>
			<CampoSelect
				id="semestre_letivo_defesa"
				rotulo="Semestre de defesa"
				opcoes={semestresOpcoes}
				bind:value={valores.semestre_letivo_defesa}
				placeholder="Não informado"
			/>
		</fieldset>

		<fieldset>
			<legend>Aluno e orientação</legend>
			<CampoSelect
				id="aluno"
				rotulo="Aluno"
				opcoes={alunosOpcoes}
				bind:value={valores.aluno}
				obrigatorio
				erro={erros.aluno ?? ''}
			/>
			<CampoSelect
				id="orientador"
				rotulo="Orientador"
				opcoes={professoresOpcoes}
				bind:value={valores.orientador}
				obrigatorio
				erro={erros.orientador ?? ''}
			/>
			<CampoSelect
				id="coorientador"
				rotulo="Coorientador"
				opcoes={professoresOpcoes}
				bind:value={valores.coorientador}
				placeholder="Sem coorientador"
			/>
		</fieldset>

		<fieldset>
			<legend>Banca</legend>
			<CampoSelect
				id="presidente"
				rotulo="Presidente da banca"
				opcoes={professoresOpcoes}
				bind:value={valores.presidente}
				obrigatorio
				erro={erros.presidente ?? ''}
			/>
			<CampoSelect
				id="primeiro_membro"
				rotulo="Primeiro membro"
				opcoes={professoresOpcoes}
				bind:value={valores.primeiro_membro}
				obrigatorio
				erro={erros.primeiro_membro ?? ''}
			/>
			<CampoSelect
				id="segundo_membro"
				rotulo="Segundo membro"
				opcoes={professoresOpcoes}
				bind:value={valores.segundo_membro}
				obrigatorio
				erro={erros.segundo_membro ?? ''}
			/>
		</fieldset>

		<fieldset>
			<legend>Arquivo</legend>
			<div class="campo">
				<label for="arquivo">Arquivo do trabalho (PDF, opcional)</label>
				<input
					id="arquivo"
					type="file"
					accept="application/pdf"
					onchange={aoSelecionarArquivo}
					aria-invalid={erroArquivo ? 'true' : undefined}
					aria-describedby={erroArquivo ? 'erro-arquivo' : 'dica-arquivo'}
				/>
				<p id="dica-arquivo" class="dica">Apenas PDF, até 10 MB.</p>
				{#if erroArquivo}
					<p class="erro-campo" id="erro-arquivo" role="alert">{erroArquivo}</p>
				{/if}
			</div>
		</fieldset>

		<div class="acoes">
			<button type="submit" class="botao-enviar" disabled={enviando}>
				{enviando ? 'Cadastrando…' : 'Cadastrar TCC'}
			</button>
			<a href="/tccs">Cancelar</a>
		</div>
	</form>
{/if}

<style>
	form {
		max-width: 46rem;
	}

	.resumo-erros {
		margin-bottom: var(--espaco-4);
		padding: var(--espaco-3) var(--espaco-4);
		border: 2px solid var(--status-reprovado);
		border-radius: var(--raio);
		background: var(--cor-superficie);
	}

	.resumo-erros h2 {
		margin-top: 0;
		font-size: 1.1rem;
		color: var(--status-reprovado);
	}

	.dica {
		margin: var(--espaco-1) 0 0;
		color: var(--cor-texto-suave);
		font-size: 0.9rem;
	}

	.acoes {
		display: flex;
		align-items: center;
		gap: var(--espaco-4);
		margin-top: var(--espaco-4);
	}

	.botao-enviar {
		padding: var(--espaco-2) var(--espaco-5);
		font: inherit;
		font-weight: 600;
		color: #fff;
		background: var(--cor-primaria-escura);
		border: 1px solid transparent;
		border-radius: var(--raio);
		cursor: pointer;
	}

	.botao-enviar:hover {
		background: var(--cor-primaria);
	}

	.botao-enviar:disabled {
		opacity: 0.7;
		cursor: progress;
	}
</style>
