# Front-end — Sistema de Gestão de TCCs (UFLA)

Interface web para gestão de Trabalhos de Conclusão de Curso da Universidade Federal de Lavras,
consumindo a API REST (Django REST Framework) fornecida. Construída com foco em **acessibilidade**
(eMAG / WCAG 2.1 AA) e postura institucional "governamental".

## Stack

- **SvelteKit + TypeScript**
- **CSS puro com design tokens** (sem framework de UI) — identidade híbrida gov.br + UFLA
- **Gráfico de barras próprio** (CSS) no dashboard, sempre com tabela alternativa acessível
- **Vitest** (unitário) + **Playwright** + **@axe-core/playwright** (E2E e acessibilidade)
- Build/deploy com **@sveltejs/adapter-node**; orquestração com **Docker Compose**

## Como rodar (desenvolvimento)

Pré-requisito: a API back-end rodando em `http://127.0.0.1:8000` (ver `../projeto-gestao-tccs`).

```bash
npm install
cp .env.example .env        # opcional; o padrão já aponta para 127.0.0.1:8000/api
npm run dev                 # http://localhost:5173
```

A URL da API é configurável por `VITE_API_BASE_URL` (padrão `http://127.0.0.1:8000/api`).

## Como rodar (Docker — sistema inteiro)

Na raiz do repositório (um nível acima), o `docker-compose.yml` sobe back-end + front-end:

```bash
docker compose up --build
# front-end: http://localhost:3000
# back-end:  http://localhost:8000/api
```

O container do back-end roda `migrate` + `load.py` no start (≈100 TCCs de teste).

## Testes

```bash
npm run check                # type-check (svelte-check)
npm run test:unit -- --run   # unitários (Vitest)
npm run test:e2e             # E2E + acessibilidade (Playwright + axe)
npm run lighthouse           # performance/acessibilidade (Lighthouse CI, on-demand)
```

- **Unitários:** cliente da API, validações, transformações (lookup id→nome, status, séries),
  filtros/ordenação, tema, breadcrumbs.
- **E2E:** listagens + busca/filtros (refletidos na URL), cadastro com upload, alteração de status,
  exclusão com diálogo acessível, dashboard (gráfico + tabela), home, responsividade e cabeçalhos
  de segurança. Cada página/estado é auditado com **axe** (WCAG 2.1 A/AA).
- **Cross-browser:** projetos Playwright para **chromium** e **firefox** (webkit disponível via
  `npx playwright install-deps webkit`).

## Acessibilidade

- HTML semântico, skip link, landmarks, `lang="pt-BR"`, breadcrumbs e foco visível.
- Navegação 100% por teclado; diálogo de exclusão com foco preso (elemento nativo `<dialog>`).
- Status comunicado por texto + cor (nunca só cor); tabelas com `caption`/`th scope`.
- Feedback dinâmico via `aria-live` (toasts, estados de carregando/erro/vazio).
- Gráficos do dashboard sempre acompanhados de tabela equivalente.
- **Tema claro/escuro** acessível (`aria-pressed`, persistido, sem flash).
- Testado automaticamente com axe; recomenda-se teste manual com leitor de tela (Orca/NVDA).

## Decisões de projeto

- **Escopo:** CRUD completo apenas de TCC (cadastrar, alterar status, excluir); demais recursos
  (Alunos, Professores, Cursos, Departamentos, Unidades) são **somente leitura** (listagem + busca).
- **Relacionamentos como IDs:** a API serializa FKs como IDs; o front pré-carrega os recursos
  relacionados e resolve **nomes** via mapas de lookup.
- **Busca:** Alunos/Professores/TCCs usam `?search=` no back-end; Cursos/Departamentos/Unidades
  são filtrados no cliente (a API não oferece busca para eles).
- **Identidade visual:** paleta oficial extraída do logo da UFLA (verde `#009551`, azul `#006199`);
  logo colorido no tema claro e monocromático negativo no tema escuro.
- **Segurança:** validação de tipo/tamanho do PDF, saída escapada por padrão (Svelte) e cabeçalhos
  de segurança via `hooks.server.ts`.

## Estrutura

```text
src/
  app.html                 # lang="pt-BR" + script de tema (anti-flash)
  hooks.server.ts          # cabeçalhos de segurança
  routes/                  # home, dashboard, tccs (+ novo), alunos, professores, cursos, …
  lib/
    api/                   # client, endpoints, types
    components/            # ListaRecurso, Campo*, StatusBadge, DialogoConfirmacao, Toasts, gráficos
    tccs/                  # lógica de listagem, formulário, opções
    dashboard/             # transformação de séries
    styles/                # tokens.css, global.css
```
# front-end_prog-web
