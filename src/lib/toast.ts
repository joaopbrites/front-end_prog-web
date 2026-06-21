/** Tipos e fábrica puros do sistema de notificações (toast). */

export type TipoToast = 'sucesso' | 'erro';

export interface Toast {
	id: number;
	mensagem: string;
	tipo: TipoToast;
}

export function criarToast(id: number, mensagem: string, tipo: TipoToast): Toast {
	return { id, mensagem, tipo };
}
