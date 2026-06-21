/** Lógica pura do formulário de cadastro de TCC (validação + montagem do envio). */

export interface ValoresTcc {
	titulo: string;
	resumo: string;
	palavras_chave: string;
	tipo: string;
	idioma: string;
	aluno: string;
	orientador: string;
	coorientador: string;
	presidente: string;
	primeiro_membro: string;
	segundo_membro: string;
	semestre_letivo_defesa: string;
}

export function valoresIniciais(): ValoresTcc {
	return {
		titulo: '',
		resumo: '',
		palavras_chave: '',
		tipo: '',
		idioma: '',
		aluno: '',
		orientador: '',
		coorientador: '',
		presidente: '',
		primeiro_membro: '',
		segundo_membro: '',
		semestre_letivo_defesa: ''
	};
}

export const CAMPOS_OBRIGATORIOS = [
	'titulo',
	'resumo',
	'palavras_chave',
	'tipo',
	'idioma',
	'aluno',
	'orientador',
	'presidente',
	'primeiro_membro',
	'segundo_membro'
] as const;

export type ErrosTcc = Partial<Record<keyof ValoresTcc, string>>;

/** Valida os campos obrigatórios. Retorna um mapa campo → mensagem (vazio se válido). */
export function validarFormularioTcc(valores: ValoresTcc): ErrosTcc {
	const erros: ErrosTcc = {};
	for (const campo of CAMPOS_OBRIGATORIOS) {
		if (!valores[campo] || valores[campo].trim() === '') {
			erros[campo] = 'Campo obrigatório.';
		}
	}
	return erros;
}

export const TAMANHO_MAX_PDF = 10 * 1024 * 1024; // 10 MB

/** Valida o arquivo enviado (opcional). Retorna mensagem de erro ou null. */
export function validarArquivoPdf(arquivo: File | null, maxBytes = TAMANHO_MAX_PDF): string | null {
	if (!arquivo) return null;
	if (arquivo.type !== 'application/pdf') {
		return 'O arquivo deve estar no formato PDF.';
	}
	if (arquivo.size > maxBytes) {
		const mb = Math.round(maxBytes / (1024 * 1024));
		return `O arquivo excede o tamanho máximo de ${mb} MB.`;
	}
	return null;
}

/** Monta o FormData para envio (multipart), omitindo opcionais vazios. */
export function montarFormDataTcc(valores: ValoresTcc, arquivo: File | null): FormData {
	const fd = new FormData();
	const sempre: (keyof ValoresTcc)[] = [
		'titulo',
		'resumo',
		'palavras_chave',
		'tipo',
		'idioma',
		'aluno',
		'orientador',
		'presidente',
		'primeiro_membro',
		'segundo_membro'
	];
	for (const campo of sempre) {
		fd.set(campo, valores[campo]);
	}
	if (valores.coorientador) fd.set('coorientador', valores.coorientador);
	if (valores.semestre_letivo_defesa)
		fd.set('semestre_letivo_defesa', valores.semestre_letivo_defesa);
	if (arquivo) fd.set('arquivo', arquivo);
	return fd;
}

/** Rótulos legíveis dos campos (para resumo de erros). */
export const ROTULOS_CAMPOS: Record<keyof ValoresTcc, string> = {
	titulo: 'Título',
	resumo: 'Resumo',
	palavras_chave: 'Palavras-chave',
	tipo: 'Tipo',
	idioma: 'Idioma',
	aluno: 'Aluno',
	orientador: 'Orientador',
	coorientador: 'Coorientador',
	presidente: 'Presidente da banca',
	primeiro_membro: 'Primeiro membro',
	segundo_membro: 'Segundo membro',
	semestre_letivo_defesa: 'Semestre de defesa'
};
