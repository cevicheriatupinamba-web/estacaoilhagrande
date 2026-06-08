## Realidade primeiro

A solicitação "MODO DEUS" mistura ~15 frentes de trabalho independentes (imagens, layout, SEO técnico, 5 artigos novos de 1200+ palavras, link building, scanner de imagens quebradas, responsividade em 5 breakpoints, etc.). Tentar fazer tudo em uma só rodada produziria mudanças superficiais em vez de correções reais. Proponho dividir em **4 lotes** e executar **o Lote 1 já nesta rodada**. Depois você confirma se sigo para o 2, 3 e 4.

---

## Lote 1 — AGORA (correções concretas e verificáveis)

1. **Passeio VIP de Lancha** — remover duplicação, garantir imagem real de lancha premium em Ilha Grande, descrição + CTA + SEO corretos em `src/data/listings.ts` e nas páginas que o referenciam.
2. **Scanner de imagens incoerentes** — auditar `src/lib/curatedImages.ts`, `src/lib/images.ts` e todos os `themedImage(...)` usados em Passeios, Praias, Hospedagem, Restaurantes. Trocar qualquer ID Unsplash que não represente o item (foco nos slugs já mapeados: Lopes Mendes, Lagoa Azul/Verde, Aventureiro, Parnaioca, Feiticeira, Dois Rios, etc.).
3. **Hospedagem / Restaurantes** — substituir imagens "paisagem genérica" por categorias corretas (interior de pousada, prato, mesa).
4. **Seção "Tem um negócio em Ilha Grande?"** (Home / Anuncie CTA) — corrigir alinhamento, espaçamento, ícones, responsividade mobile.
5. **Confirmar remoção total** do aviso "Informações baseadas em guias públicos...". `Disclaimer.tsx` já retorna `null`, mas vou varrer o projeto para garantir que nenhum texto literal restou em outras páginas.

## Lote 2 — SEO técnico global
- Auditar todas as páginas listadas em `src/App.tsx` e garantir `<SEO>` com title, description, keywords, breadcrumbs, JSON-LD em cada uma.
- Adicionar Schema `TouristAttraction` / `Restaurant` / `LodgingBusiness` nas páginas de detalhe.
- Atualizar `public/sitemap.xml` com todas as rotas + posts do blog.
- OG image padrão da marca.

## Lote 3 — Conteúdo de Blog (5 artigos novos)
- Criar 5 posts (1200+ palavras cada) via migração SQL na tabela `blog_posts`, com FAQ, links internos, imagens curadas, schema Article. Slugs propostos:
  - `15-melhores-praias-de-ilha-grande`
  - `onde-se-hospedar-em-ilha-grande-guia-completo`
  - `roteiro-3-dias-ilha-grande`
  - `melhores-restaurantes-ilha-grande`
  - `passeios-imperdiveis-ilha-grande`

## Lote 4 — Linkagem externa + QA responsivo
- Adicionar links externos estratégicos (CCR Barcas, Booking, Google Maps, Climatempo, Prefeitura Angra, INEA) em páginas pertinentes, com `target="_blank" rel="noopener nofollow"`.
- QA visual em 393px (mobile), 768px (tablet), 1280px+ (desktop) nas páginas chave.

---

## Decisão necessária

Confirma que eu **executo agora o Lote 1** e, ao terminar, te devolvo um resumo + pergunto se sigo para o Lote 2? Ou prefere reordenar (ex.: priorizar Blog antes das imagens)?
