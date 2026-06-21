import { browser } from '$app/environment';
import { proximoTema, type Tema } from './theme';

/** Estado reativo do tema, sincronizado com o atributo data-tema do <html>. */
let atual = $state<Tema>('light');

export const estadoTema = {
	get atual(): Tema {
		return atual;
	},

	/** Sincroniza o estado com o tema já aplicado pelo script inline (em app.html). */
	iniciar(): void {
		if (!browser) return;
		atual = document.documentElement.getAttribute('data-tema') === 'dark' ? 'dark' : 'light';
	},

	/** Alterna o tema, atualizando o DOM e persistindo a escolha. */
	alternar(): void {
		atual = proximoTema(atual);
		if (browser) {
			document.documentElement.setAttribute('data-tema', atual);
			try {
				localStorage.setItem('tema', atual);
			} catch {
				/* armazenamento indisponível */
			}
		}
	}
};
