import { describe, it, expect } from 'vitest';
import {
	valoresIniciais,
	validarFormularioTcc,
	validarArquivoPdf,
	montarFormDataTcc,
	type ValoresTcc
} from './formulario';

function valoresCompletos(): ValoresTcc {
	return {
		titulo: 'Sistema X',
		resumo: 'Um resumo',
		palavras_chave: 'web, django',
		tipo: 'MONOGRAFIA',
		idioma: 'PT',
		aluno: '1',
		orientador: '7',
		coorientador: '',
		presidente: '7',
		primeiro_membro: '8',
		segundo_membro: '9',
		semestre_letivo_defesa: ''
	};
}

describe('validarFormularioTcc', () => {
	it('acusa todos os obrigatórios quando vazio', () => {
		const erros = validarFormularioTcc(valoresIniciais());
		expect(Object.keys(erros)).toHaveLength(10);
		expect(erros.titulo).toBe('Campo obrigatório.');
	});

	it('não acusa erros quando os obrigatórios estão preenchidos', () => {
		expect(validarFormularioTcc(valoresCompletos())).toEqual({});
	});

	it('considera espaços em branco como vazio', () => {
		const erros = validarFormularioTcc({ ...valoresCompletos(), titulo: '   ' });
		expect(erros.titulo).toBe('Campo obrigatório.');
	});
});

describe('validarArquivoPdf', () => {
	it('aceita ausência de arquivo (opcional)', () => {
		expect(validarArquivoPdf(null)).toBeNull();
	});

	it('rejeita tipo diferente de PDF', () => {
		const arquivo = new File(['x'], 'a.txt', { type: 'text/plain' });
		expect(validarArquivoPdf(arquivo)).toMatch(/PDF/);
	});

	it('rejeita arquivo acima do tamanho máximo', () => {
		const arquivo = new File(['abcdef'], 'a.pdf', { type: 'application/pdf' });
		expect(validarArquivoPdf(arquivo, 3)).toMatch(/máximo/);
	});

	it('aceita PDF dentro do limite', () => {
		const arquivo = new File(['ab'], 'a.pdf', { type: 'application/pdf' });
		expect(validarArquivoPdf(arquivo, 1024)).toBeNull();
	});
});

describe('montarFormDataTcc', () => {
	it('inclui os campos obrigatórios', () => {
		const fd = montarFormDataTcc(valoresCompletos(), null);
		expect(fd.get('titulo')).toBe('Sistema X');
		expect(fd.get('aluno')).toBe('1');
		expect(fd.get('segundo_membro')).toBe('9');
	});

	it('omite opcionais vazios', () => {
		const fd = montarFormDataTcc(valoresCompletos(), null);
		expect(fd.has('coorientador')).toBe(false);
		expect(fd.has('semestre_letivo_defesa')).toBe(false);
		expect(fd.has('arquivo')).toBe(false);
	});

	it('inclui o arquivo quando presente', () => {
		const arquivo = new File(['ab'], 'a.pdf', { type: 'application/pdf' });
		const fd = montarFormDataTcc({ ...valoresCompletos(), coorientador: '8' }, arquivo);
		expect(fd.get('coorientador')).toBe('8');
		expect(fd.get('arquivo')).toBeInstanceOf(File);
	});
});
