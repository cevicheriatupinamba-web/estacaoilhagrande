# Reestruturação Estação Ilha Grande — Fase 1

Vou implementar apenas o que tem backend real funcionando hoje. Tudo que for "em construção" sai do menu, da navegação e dos cards. Sem placeholders.

## 1. Limpeza imediata (sai do ar)

**Admin** — remover do menu lateral e das rotas:
- SEO, BI, Marketing, Crescimento, Mapa, Suporte, Avaliações

**Mantidos no Admin** (têm dados reais ou função operacional):
- Painel Admin (dashboard)
- Anunciantes (CRM)
- Assinaturas
- Financeiro
- Solicitações (leads — já existe tabela `lead_requests`)
- Conteúdo (blog)
- Permissões
- Configurações
- Auditoria (activity_logs)

**Anunciante** — menu fica só com o que funciona:
- Visão geral, Minha empresa, Meu plano, Financeiro

## 2. Papéis e permissões

Enum `app_role` já tem: super_admin, admin, financial_manager, content_manager, support_agent, advertiser, user.

Ações:
- Renomear semanticamente `user` → tratado como **customer** na UI (sem mudar o enum, evita migração quebrada).
- Confirmar guards: `AdminLayout` (super_admin/admin), `AdvertiserLayout` (advertiser + admin), novo `CustomerLayout` (qualquer usuário logado) para `/minha-conta`.
- RLS já existe nas tabelas principais; revisar `listings`, `subscriptions`, `lead_requests` para garantir que o anunciante só lê o que é dele (`owner_id = auth.uid()`).

## 3. Três ecossistemas (rotas)

```text
/admin/*          → Super Admin / staff
/dashboard,
/minha-empresa,
/minha-assinatura → Anunciante (extranet)
/minha-conta/*    → Turista (customer)
```

## 4. Ecossistema Turista — novo

Criar `/minha-conta` com:
- **Perfil**: nome, email, whatsapp, cidade, país, idioma (tabela `profiles` nova, ligada a `auth.users`).
- **Favoritos**: já existem em localStorage; migrar para tabela `favorites` (user_id, listing_id) com RLS por dono.
- **Histórico**: lista de favoritos + avaliações futuras (Fase 2).

Layout próprio com navegação simples (sem sidebar pesado). Mobile-first.

## 5. Ecossistema Anunciante — completar Fase 1

Já existe Dashboard + Minha Empresa + Minha Assinatura. Adicionar:
- **Galeria** (`/minha-galeria`): upload múltiplo, drag&drop, reordenar, marcar capa. Usa bucket `listing-photos` + tabela `pousada_imagens` (já existe) — generalizar para listings também.
- **Financeiro** (`/meu-financeiro`): histórico de `subscription_payments` com download de recibo (PDF gerado client-side simples) e botão "Renovar via WhatsApp".
- **Minha Empresa**: expandir formulário com horário, serviços, diferenciais, redes sociais completas, localização no mapa (campos lat/lng já existem em listings).

Dashboard ganha:
- Filtros de período (hoje / 7d / 30d / 90d / ano) — já parcialmente feito.
- KPIs: visualizações, cliques WhatsApp, Instagram, telefone, favoritos, solicitações.
- Comparativo vs período anterior (% delta).

## 6. Ecossistema Super Admin — ajustes

- **Permissões** (`/admin/roles`): trocar exibição de UUIDs por nome+email+cargo+status+data, com ações Editar/Remover. Join `user_roles` + `auth.users` via função SECURITY DEFINER `get_users_with_roles()`.
- **Dashboard Executivo**: KPIs reais (MRR, ativos, cancelados, novos no mês, leads do mês) a partir de `subscriptions` e `lead_requests`. Sem gráficos falsos — só o que sai do banco.

## 7. Banco — migrações necessárias

1. `profiles` (user_id PK, name, whatsapp, city, country, language, avatar_url) + RLS dono.
2. `favorites` (user_id, listing_id, created_at) + RLS dono + GRANTs.
3. Função `get_users_with_roles()` SECURITY DEFINER para painel de permissões.
4. Revisão RLS: anunciante só vê `subscriptions`/`subscription_payments`/`lead_requests`/`listing_events` dos seus listings.

## 8. O que NÃO entra nesta fase

Avaliações, Reservas, Cupons, Promoções, SEO Center, BI avançado, Heatmap, Ranking, Suporte interno, Notificações, Pagamento online. Ficam para Fase 2/3 conforme roadmap — e **não aparecem na UI** até estarem prontos.

## Detalhes técnicos

- Stack mantida: React 18 + Vite + Tailwind + shadcn + Supabase.
- Sem novas dependências pesadas (recharts já está). Upload de imagem usa `supabase.storage` existente.
- Recibo PDF: `window.print()` em página dedicada com CSS print (sem libs).
- Mobile-first: revisar Navbar para mostrar bottom-nav no turista logado.
- Tudo via design tokens em `index.css` (sem cores hardcoded).

## Ordem de execução

1. Migração: `profiles`, `favorites`, função `get_users_with_roles`, ajustes RLS.
2. Limpeza Admin (menu + rotas mortas).
3. Painel `/admin/roles` reescrito com dados úteis.
4. Anunciante: Galeria + Meu Financeiro + Minha Empresa expandida + Dashboard com comparativo.
5. Turista: `/minha-conta` (Perfil + Favoritos no banco + Histórico).
6. Bottom-nav mobile para turista logado.
7. QA: testar 3 contas (super_admin, advertiser, customer) e validar isolamento.