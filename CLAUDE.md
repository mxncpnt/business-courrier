@AGENTS.md

# Projet Courrier IA — Contexte

## Quoi
Service web permettant aux particuliers d'obtenir un courrier administratif/juridique personnalisé (résiliation, mise en demeure, réclamation, contestation, etc.), généré par IA, téléchargeable en PDF. Prix : 4,90€/courrier.

## Qui
- Fondateur solo : Maxence (maxence.pinta@gmail.com)
- Projet d'initiation — objectif = montée en compétences sur un projet SaaS complet
- Repo GitHub : mxncpnt/business-courrier

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth magic link + Storage PDFs)
- API Claude (Anthropic) pour génération des courriers
- Stripe Checkout pour paiement
- Resend + React Email pour emails transactionnels
- Vercel pour hosting (déploiement auto depuis GitHub)
- @react-pdf/renderer pour génération PDF
- pnpm comme gestionnaire de paquets

## Structure du projet
```
src/app/                        # Pages (App Router)
src/app/courrier/[type]/        # Formulaire dynamique par type
src/app/preview/[id]/           # Prévisualisation courrier
src/app/paiement/               # Pages succès/annulation
src/app/dashboard/              # Historique (connecté)
src/app/api/                    # Routes API (génération, webhook, download)
src/components/                 # Composants React
src/lib/                        # Utilitaires (supabase, stripe, claude, pdf, email)
src/config/letter-types.ts      # Catalogue 10 types + champs formulaire
src/types/                      # Types TypeScript partagés
supabase/migrations/            # Migrations SQL
```

## Base de données (Supabase — 2 tables + 1 bucket)
- `letters` : id, user_id, email, type, form_data (JSONB), generated_text, final_text, status (draft/paid/delivered), pdf_path
- `payments` : id, letter_id, stripe_checkout_session_id, stripe_payment_intent_id, amount_cents, status
- `letter_types` : config en fichier TS (slug, title, category, fields, prompt_template, price_cents)
- Bucket `pdfs` : stockage des PDFs générés, accès par propriétaire via RLS
- RLS activé sur les deux tables

## Décisions prises
- Pas d'inscription obligatoire pour générer. Auth optionnelle pour l'historique.
- Prévisualisation floutée partiellement — paiement pour accès complet + PDF.
- Pas d'envoi postal en MVP (Phase 4).
- Pas d'abonnement — paiement à l'acte uniquement.
- 10 types de courriers MVP : résiliation (2), contestation (3), réclamation (2), mise en demeure (2), demande (1).
- Validation serveur avec zod.
- Rate limiting sur endpoint génération.
- Nom de travail provisoire : "Courrier IA" (nom définitif pas encore choisi).

## Conventions
- Langue du code : anglais (noms de variables, composants)
- Langue du contenu : français
- Commits : messages courts en anglais
- pnpm comme gestionnaire de paquets

## Comptes configurés
- GitHub : mxncpnt (gh auth login ✓)
- Vercel : connecté via dashboard (vercel login ✓)
- Supabase : projet "courrier-ia", région EU (supabase login ✓)
- Stripe : mode test (stripe login ✓)
- Anthropic : configuré (clé API dans .env.local ✓)
- Resend : à configurer

## Docs de référence
- Specs fonctionnelles : ../02-produit/specs-fonctionnelles.md
- Architecture : ../03-technique/architecture.md
- Plan d'action : ../00-setup/plan-action.md
- Documentation projet : ../00-setup/documentation-projet.docx

## Statut actuel
- [x] Setup local (outils CLI installés, Node 24 LTS, pnpm)
- [x] Projet Next.js créé + déployé sur Vercel
- [x] Repo GitHub connecté (déploiement auto)
- [x] Specs fonctionnelles rédigées
- [x] Architecture définie
- [x] Base de données Supabase configurée (tables + RLS + bucket)
- [x] Landing page + catalogue des 10 types de courriers
- [x] Formulaire dynamique par type (src/app/courrier/[type]/ + src/components/LetterForm.tsx)
- [x] Intégration API Claude (src/lib/claude.ts, modèle claude-sonnet-4-6)
- [x] Prévisualisation floutée (src/app/preview/[id]/ + src/components/LetterPreview.tsx)
- [x] Intégration Stripe Checkout (src/lib/stripe.ts, src/app/api/checkout/, src/app/api/stripe-webhook/)
- [x] Pages paiement succès/annulation (src/app/paiement/)
- [ ] Génération PDF (téléchargement après paiement) ← PROCHAIN
- [ ] Emails transactionnels (Resend)
- [ ] CGV / mentions légales / RGPD
- [ ] Auth optionnelle (Supabase Auth magic link)
- [ ] Déploiement production (variables d'env Vercel)

## Notes techniques
- Supabase : GRANT ALL sur letters/payments nécessaire pour service_role (fait manuellement via SQL Editor)
- Stripe : mode test, webhook via `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Claude : modèle claude-sonnet-4-6 (l'ancien claude-sonnet-4-20250514 est déprécié)
