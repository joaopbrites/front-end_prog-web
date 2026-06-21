<script lang="ts">
	let {
		id,
		rotulo,
		value = $bindable(''),
		tipo = 'text',
		obrigatorio = false,
		erro = ''
	}: {
		id: string;
		rotulo: string;
		value?: string;
		tipo?: 'text' | 'textarea';
		obrigatorio?: boolean;
		erro?: string;
	} = $props();

	const idErro = $derived(`erro-${id}`);
</script>

<div class="campo">
	<label for={id}>
		{rotulo}{#if obrigatorio}<span class="obrigatorio" aria-hidden="true"> *</span>{/if}
	</label>
	{#if tipo === 'textarea'}
		<textarea
			{id}
			bind:value
			aria-required={obrigatorio ? 'true' : undefined}
			aria-invalid={erro ? 'true' : undefined}
			aria-describedby={erro ? idErro : undefined}
		></textarea>
	{:else}
		<input
			{id}
			type="text"
			bind:value
			aria-required={obrigatorio ? 'true' : undefined}
			aria-invalid={erro ? 'true' : undefined}
			aria-describedby={erro ? idErro : undefined}
		/>
	{/if}
	{#if erro}
		<p class="erro-campo" id={idErro} role="alert">{erro}</p>
	{/if}
</div>
