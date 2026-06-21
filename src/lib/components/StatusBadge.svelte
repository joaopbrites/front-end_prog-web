<script lang="ts">
	import type { Status } from '$lib/api/types';
	import { classeStatus } from '$lib/tccs/lista';

	let { status, rotulo }: { status: Status; rotulo: string } = $props();
</script>

<span class="badge badge--{classeStatus(status)}">{rotulo}</span>

<style>
	/* Status comunicado por TEXTO + cor (nunca só por cor) — WCAG 1.4.1 */
	.badge {
		display: inline-block;
		padding: 0.1em 0.6em;
		border: 1px solid currentColor;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.badge--elaboracao {
		color: var(--status-elaboracao);
	}
	.badge--enviado {
		color: var(--status-enviado);
	}
	.badge--aprovado {
		color: var(--status-aprovado);
	}
	.badge--reprovado {
		color: var(--status-reprovado);
	}
</style>
