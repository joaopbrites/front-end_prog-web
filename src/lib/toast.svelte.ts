import { criarToast, type Toast, type TipoToast } from './toast';

/** Store reativo de notificações (toasts). */
let lista = $state<Toast[]>([]);
let sequencia = 0;

export const toasts = {
	get lista(): Toast[] {
		return lista;
	},

	mostrar(mensagem: string, tipo: TipoToast = 'sucesso', duracaoMs = 5000): number {
		const toast = criarToast(++sequencia, mensagem, tipo);
		lista = [...lista, toast];
		if (duracaoMs > 0) {
			setTimeout(() => toasts.remover(toast.id), duracaoMs);
		}
		return toast.id;
	},

	remover(id: number): void {
		lista = lista.filter((t) => t.id !== id);
	}
};
