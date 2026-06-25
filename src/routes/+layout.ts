// Estas "page options" são lidas pelo SvelteKit em tempo de build (Node),
// não vão para o cliente — por isso é seguro decidir com base no env.
const estatico = process.env.ADAPTER === 'static';

// Deploy no GitHub Pages (ADAPTER=static): a app roda como SPA.
//   - ssr = false: sem renderização no servidor. Os dados são buscados no
//     cliente (onMount) e os filtros/busca leem livremente os query params —
//     algo que o prerender com SSR proíbe ("Cannot access url.searchParams").
//   - prerender = true: mesmo assim geramos um HTML (shell) por rota, para o
//     GitHub Pages responder 200 em cada URL (ex.: /tccs, /alunos) ao acessar
//     direto ou recarregar a página.
//
// Em dev/Docker/E2E (adapter-node, padrão) mantemos o comportamento original:
// SSR ligado e sem pré-renderização.
export const ssr = !estatico;
export const prerender = estatico;
