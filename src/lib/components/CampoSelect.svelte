<script lang="ts">
	let {
		id,
		rotulo,
		value = $bindable(''),
		opcoes,
		obrigatorio = false,
		erro = '',
		placeholder = 'Selecione…'
	}: {
		id: string;
		rotulo: string;
		value?: string;
		opcoes: { valor: string; rotulo: string }[];
		obrigatorio?: boolean;
		erro?: string;
		placeholder?: string;
	} = $props();

	const idErro = $derived(`erro-${id}`);
</script>

<div class="campo">
	<label for={id}>
		{rotulo}{#if obrigatorio}<span class="obrigatorio" aria-hidden="true"> *</span>{/if}
	</label>
	<select
		{id}
		bind:value
		aria-required={obrigatorio ? 'true' : undefined}
		aria-invalid={erro ? 'true' : undefined}
		aria-describedby={erro ? idErro : undefined}
	>
		<option value="">{placeholder}</option>
		{#each opcoes as opcao (opcao.valor)}
			<option value={opcao.valor}>{opcao.rotulo}</option>
		{/each}
	</select>
	{#if erro}
		<p class="erro-campo" id={idErro} role="alert">{erro}</p>
	{/if}
</div>
