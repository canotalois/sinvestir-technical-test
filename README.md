# Simulateur crypto — au format S'investir

Transposition du **simulateur crypto (DCA / plus-value)** de S'investir au **design system de la suite `simulateurs.sinvestir.fr`**, livrée comme un **composant React autonome et embarquable**.

🎯 **Démo** : **https://sinvestir.canot.dev** · 🧩 **Embed** : [`/embed`](https://sinvestir.canot.dev/embed)

---

## En bref

Le simulateur reprend la **logique DCA** du widget crypto actuel de S'investir et l'habille **1:1** au design system de la suite. Sur le scénario par défaut (Bitcoin, 25 €/semaine depuis le 01/01/2018), il reproduit fidèlement la source : **Investi 11 100 €, Acquis ~0,794 ₿, PRU ~13 970 €, Capital final ~41 850 €, Performance ~+277 %**.

---

## Rendu — réponses aux deux questions

### 1. Choix techniques / partis pris _(+ justification hors-stack)_

**Next.js** (stack annoncée) plutôt que Nuxt (suite existante) — choix assumé, design system répliqué 1:1. Logique DCA isolée en **fonction pure testée** (`decimal.js`, Vitest). **Rien réinventé** : Radix, react-day-picker, react-hook-form + zod, Floating UI, Chart.js — habillés au style S'investir. Composant **autonome / embarquable**, **données validées zod** au boundary réseau, proxy + cache assumé pour le rate-limit.

→ **Détail complet : [`docs/partis-pris.md`](./docs/partis-pris.md)**

### 2. Suggestions d'amélioration pour S'investir

Regard de partenaire : **ré-internaliser** le simulateur crypto (aujourd'hui widget tiers Fritzy, hors charte et hors contrôle), **combler le trou SEO** `/les-simulateurs/crypto` (404), **DCA vs achat unique** en surimpression, **pédagogie du risque** (drawdown, sensibilité au timing), **provider data payant** fiable en production.

→ **Backlog détaillé : [`IMPROVEMENTS.md`](./IMPROVEMENTS.md)**

---

## Démarrer

Prérequis : **Node ≥ 20**, **pnpm ≥ 9**.

```bash
pnpm install
pnpm dev        # http://localhost:3000  (app de démo)
pnpm test       # tests Vitest (logique DCA + boundary réseau)
pnpm typecheck  # tsc --noEmit sur tout le monorepo
pnpm build      # build des packages + next build
```

Aucune variable d'environnement n'est requise pour lancer la démo.

---

## Documentation

Chaque sujet a son document dédié pour garder ce README léger :

| Sujet                                       | Document                                         |
| ------------------------------------------- | ------------------------------------------------ |
| 🏗 Architecture (monorepo, couches)          | [`docs/architecture.md`](./docs/architecture.md) |
| 🧠 Choix techniques & partis pris _(Q1)_    | [`docs/partis-pris.md`](./docs/partis-pris.md)   |
| 🔌 Source de données & configuration        | [`docs/donnees.md`](./docs/donnees.md)           |
| 📊 Analytics (PostHog)                      | [`docs/analytics.md`](./docs/analytics.md)       |
| 🧩 Embarquer le simulateur                  | [`docs/embed.md`](./docs/embed.md)               |
| 🚀 Déploiement (VPS · Caddy · CI/CD)        | [`deploy/README.md`](./deploy/README.md)         |
| 💡 Suggestions pour S'investir _(Q2)_       | [`IMPROVEMENTS.md`](./IMPROVEMENTS.md)           |
| 🔎 Contexte & rétro-ingénierie de la source | [`CONTEXTE-RAPPORT.md`](./CONTEXTE-RAPPORT.md)   |
| 📐 Guidelines de code & revue               | [`GUIDELINES.md`](./GUIDELINES.md)               |

---

## Qualité

- **Tests** : `pnpm test` — logique DCA (Vitest) + contrat réseau (MSW).
- **Types** : `pnpm typecheck` — TS `strict` + `noUncheckedIndexedAccess`, zéro `as any`.
- **Revue** : [`GUIDELINES.md`](./GUIDELINES.md) + skill `/review` (branche vérifiée en mode strict).
