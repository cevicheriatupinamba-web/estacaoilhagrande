# Fase 1 V4.0 — Plano de execução

Vou implementar **somente a Fase 1**, com backend real. Tudo que não tiver dado real não entra no menu. Fases 2 e 3 (Avaliações, Leads avançados, Reservas, Promoções, Cupons, SEO Center, BI, Heatmap, IA) ficam fora.

## 1. Banco — migração única

- **invites** (id, token único, email, role, status[pending|accepted|expired|cancelled], invited_by, created_at, expires_at, accepted_at). RLS: admin gerencia tudo; rota pública valida token via RPC `accept_invite(token)` security definer.
- **platform_settings** (key, value jsonb, updated_by, updated_at) — fonte única para nome, logo, WhatsApp, e-mail, redes, CNPJ, SEO global, integrações (chaves públicas).
- **plans** (id, slug, name, price_cents, benefits jsonb, trial_days, active) — substitui constantes hardcoded de planos.
- **audit_log** (actor_id, actor_email, action, resource_type, resource_id, before jsonb, after jsonb, created_at). Generalização do `activity_logs` atual com diff antes/depois.
- Triggers: capturar antes/depois em `listings`, `subscriptions`, `user_roles`, `plans`, `platform_settings`.
- RPCs: `accept_invite(token, user_id)`, `create_invite(email, role, days)`, `get_dashboard_kpis(period)`.

## 2. Sistema de Convites (mata o "precisa logar antes")

- `/admin/invites`: criar (email + role + validade), listar (status, expira em, ações: reenviar, cancelar, copiar link, QR), busca.
- Link `/invite/:token`: página premium com logo, hero, "Entrar com Google" + "Criar conta". Após auth, RPC `accept_invite` aplica role e redireciona pro painel do role.
- E-mail via Resend é Fase 2; por ora link copiável + botão "Enviar via WhatsApp".

## 3. Super Admin — `/admin`

Menu enxuto, só rotas com backend:

```
Dashboard · Anunciantes · Assinaturas · Financeiro · Solicitações ·
Conteúdo · Convites · Permissões · Planos · Configurações · Auditoria
```

- **Dashboard Executivo**: KPIs reais via RPC `get_dashboard_kpis` — MRR, ARR, ativos, novos, churn (cancelados/ativos), leads do período, top categorias, top anunciantes. Filtros: hoje/7d/30d/90d/ano. Sem gráfico falso — só o que sai do banco.
- **Planos**: CRUD da tabela `plans`.
- **Configurações**: tabs Institucional, SEO Global, Integrações (chaves públicas em `platform_settings`; chaves secretas via secrets tool, listadas como "configurada/não configurada"), Segurança (link p/ auditoria).
- **Auditoria**: timeline com filtro por autor/ação/recurso/período; diff antes→depois.
- **Permissões**: já existe; ajustar para usar convites no fluxo "Adicionar usuário".

## 4. Anunciante — `/advertiser/*` (renomear rotas atuais)

Menu: **Dashboard · Minha Empresa · Galeria · Meu Plano · Financeiro · Estatísticas**

- **Dashboard**: já existe, refinar com filtros hoje/7d/30d/90d/ano e delta vs período anterior.
- **Minha Empresa**: expandir campos (horário, serviços, diferenciais, redes, localização lat/lng com mapa).
- **Galeria** (`/advertiser/galeria`): upload múltiplo, drag&drop, capa, ordem, legenda, alt. Bucket `listing-photos`, tabela `pousada_imagens` generalizada.
- **Meu Plano**: status, valor, próxima renovação, dias restantes, botão "Renovar via WhatsApp" (upgrade/downgrade abre WhatsApp com admin).
- **Financeiro**: histórico `subscription_payments`, recibo via `window.print()`.
- **Estatísticas**: vista detalhada de `listing_events` agrupada por tipo + origem (referrer).

## 5. Turista — `/minha-conta/*`

Já existe Perfil + Favoritos + Histórico. Adicionar:
- Bottom-nav mobile (Início, Explorar, Mapa, Favoritos, Conta) só para usuários customer/logados sem role staff/advertiser.
- Perfil: alterar senha, idioma, foto (upload pra bucket).
- Favoritos: listas (`favorite_lists`) — opcional, só se couber no escopo; senão fica em Fase 2.

## 6. Limpeza

Remover do código rotas/itens sem backend: ComingSoon do admin e do advertiser, links a SEO Center/BI/Heatmap/Marketing/Growth.

## 7. Ordem de execução

1. Migração (invites, platform_settings, plans, audit_log + triggers + RPCs).
2. Convites (admin + página pública `/invite/:token`).
3. Configurações + Planos (admin).
4. Auditoria com diff.
5. Dashboard Executivo com KPIs reais.
6. Renomear rotas anunciante para `/advertiser/*` e adicionar Galeria + Estatísticas + Financeiro.
7. Bottom-nav turista + ajustes perfil.
8. QA com 3 contas (super_admin, advertiser, customer).

## Detalhes técnicos

- Stack mantida (React 18 + Vite + Tailwind + shadcn + Supabase). Sem novas libs pesadas.
- QR code: `qrcode.react` (leve, ~5KB) — única dep nova.
- Diff de auditoria: jsonb_diff feito no trigger Postgres, renderizado em `<pre>` no front.
- Todos os textos em PT-BR; design tokens em `index.css`.

## Perguntas antes de começar

1. **Convites — entrega**: por enquanto só link copiável + botão WhatsApp, ou já configurar Resend pra enviar por e-mail nesta fase?
2. **Planos**: quero criar a tabela `plans` e migrar os planos atuais (Gratuito/Básico R$97/Destaque/Premium) — confirma esses 4 e os valores?
3. **Listas de favoritos**: entram agora ou ficam pra Fase 2?
4. **Renomear `/dashboard` `/minha-empresa` `/minha-assinatura` → `/advertiser/*`**: faço redirect das rotas antigas pra não quebrar links?
