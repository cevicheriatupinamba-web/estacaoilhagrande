# Admin Platform — Estação Ilha Grande

This is a very large scope (≈18 modules, role system, payments, CRM, BI, CMS, SEO, support, marketing, growth). Building it all in one shot would produce shallow, broken modules. I'll deliver it in phases — each phase ships a usable, real (not mocked) slice connected to Lovable Cloud.

Before I start, I need a few decisions from you (see questions at the end).

---

## Architecture

- **Route**: `/admin` (existing) becomes a full layout with collapsible sidebar (shadcn `Sidebar`), top bar, breadcrumbs.
- **Auth/roles**: extend `app_role` enum (currently `admin`, `moderator`, `user`) → add `super_admin`, `financial_manager`, `content_manager`, `support_agent`. Keep RLS via `has_role()`.
- **Data**: real data from existing tables (`listings`, `pousadas`, `blog_posts`, `lead_requests`, `user_roles`, `auth.users`). New tables added per phase.
- **Charts**: `recharts` (already in stack).
- **Map**: Leaflet + OpenStreetMap satellite tiles (no API key).
- **Mobile**: every module responsive from day one.

---

## Phase 1 — Foundation (ship first)

1. Role system migration: add 4 new roles, seed your account as `super_admin`, add `has_any_role()` helper, route guard, permission matrix.
2. Admin shell: sidebar + topbar + responsive layout, dark/light, breadcrumbs.
3. **Executive Dashboard** with real KPIs from existing tables (advertisers, plans, leads, reviews, users) + period filter (Today / 7 / 30 / 90 / YTD) + recharts visuals.
4. **Advertiser CRM** — table over `listings` + `pousadas` with filters, profile drawer, quick actions (suspend/activate/upgrade plan/WhatsApp/email).
5. **Activity log** table + helper to write entries from all admin mutations.

## Phase 2 — Revenue & Subscriptions

6. New tables: `subscriptions`, `payments`, `plans` (with grants + RLS).
7. **Subscription Center** + **Plan Management** + **Renewal alerts** (cron-style edge function checking days-to-renew, writing notifications).
8. **Financial Center** — gross/net, by plan, by category, charts.
9. Payments: I recommend enabling **Lovable Payments (Stripe)** to actually charge advertisers. Confirm before I run `recommend_payment_provider` + enable.

## Phase 3 — Content, Reviews, Leads

10. **Lead Management** built on existing `lead_requests` with conversion funnel.
11. New `reviews` table + **Review Moderation** workflow.
12. **CMS** for beaches/restaurants/pousadas/tours/blog with publish/schedule/archive.
13. **Premium Positioning Control** — feature flags on listings, homepage banner slots.

## Phase 4 — Intelligence & Ops

14. **Platform Map** (Leaflet satellite) with category filters, premium highlighted.
15. **BI reports** — top viewed/contacted/converting + auto-insights.
16. **SEO Command Center** — sitemap status, meta audit over routes, GSC data once OAuth is wired.
17. **Support Center** — tickets table + thread UI.
18. **Marketing Center** — coupons/campaigns + tracking.
19. **Growth Center** — cohort/trend charts.
20. **Security** — audit log viewer, login history, 2FA toggle scaffolding.

---

## What I need from you to start Phase 1

1. **Scope confirmation** — OK to ship in phases as above? (Trying to build all 18 modules in one turn will produce broken UI.)
2. **Payments** — do you want me to enable Lovable Payments (Stripe) in Phase 2 to actually bill advertisers, or keep subscriptions as manual records you mark paid?
3. **Your super_admin email** — which email should I grant `super_admin` to in the seed migration?
4. **Plan prices** — Basic R$97/mo confirmed. What are the Featured and Premium monthly prices (and annual discount %)?

Reply with answers (or "go" + the email if you accept defaults: phased build, manual subscriptions for now, Featured R$197, Premium R$397, annual 20% off) and I'll start Phase 1 immediately.
