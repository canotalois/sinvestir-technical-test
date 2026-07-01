# Simulateur crypto — au format S'investir

Transposition du **simulateur crypto (DCA / plus-value)** de S'investir au **design system de la suite `simulateurs.sinvestir.fr`**, livrée comme un **composant React autonome et embarquable**.

- 🎯 **Démo en ligne** : **https://sinvestir.canot.dev**
- 🧩 **Embed** : [`/embed`](https://sinvestir.canot.dev/embed) (le simulateur seul, sans habillage)
- 📄 Contexte & rétro-ingénierie de la source : [`CONTEXTE-RAPPORT.md`](./CONTEXTE-RAPPORT.md)

> **Rendu — les deux volets demandés sont traités ici :**
>
> 1. **Choix techniques / partis pris** (+ justification hors-stack) → section **[Choix techniques & partis pris](#choix-techniques--partis-pris)**.
> 2. **Suggestions d'amélioration pour S'investir** → section **[Suggestions pour S'investir](#suggestions-damélioration-pour-sinvestir)** (synthèse), et le backlog détaillé **[`IMPROVEMENTS.md`](./IMPROVEMENTS.md)**.

Sur un même scénario (Bitcoin, 25 €/semaine depuis le 01/01/2018), le simulateur reproduit fidèlement la source : **Investi 11 100 €, Acquis ~0,794 ₿, PRU ~13 970 €, Capital final ~41 850 €, Performance ~+277 %**.

---

## Démarrer

Prérequis : **Node ≥ 20**, **pnpm ≥ 9**.

```bash
pnpm install
pnpm dev        # http://localhost:3000  (app de démo)
pnpm test       # tests Vitest (logique DCA + boundary réseau)
pnpm typecheck  # tsc --noEmit sur tout le monorepo
pnpm lint       # eslint
pnpm build      # build des packages + next build
```

Aucune variable d'environnement n'est requise pour lancer la démo (voir [Source de données](#source-de-données)). L'analytics PostHog est optionnel (voir [Analytics](#analytics-posthog)).

---

## Architecture

Monorepo **pnpm** — la logique est isolée du framework, le composant ne dépend ni de Next ni du routing.

```
packages/
  tokens/                # Design tokens S'investir (valeurs TS pour Chart.js, aligné au @theme)
  crypto-simulator/      # Composant React autonome <CryptoSimulator/>
    src/core/            #   simulate() — backtest DCA pur, testé (zéro dépendance UI/réseau)
    src/data/            #   client zod-validé (fetchCoins / fetchPriceHistory) + hooks React
    src/ui/              #   composants (form RHF, KPI, 4 graphiques Chart.js, date range picker)
apps/
  web/                   # App Next.js (App Router) — démo + /embed + routes API
    app/api/coins/...    #   route handlers proxy CoinGecko/Fritzy (cache + validation zod)
    app/api/_providers/  #   abstraction de la source de données (provider configurable)
    app/providers.tsx    #   PostHog (reverse-proxy via /ingest)
```

**Couches** : `core` (calcul pur) → `data` (contrat réseau validé) → `ui` (présentation) → `apps/web` (intégration + données). Chaque couche fait confiance à celle du dessous (cf. [`GUIDELINES.md`](./GUIDELINES.md)).

---

## Choix techniques & partis pris

> **Q1 du rendu** — le raisonnement derrière chaque décision, dont la justification du choix hors-stack (Next.js).

**Next.js plutôt que Nuxt.** La suite existante `simulateurs.sinvestir.fr` est en **Nuxt 3** — mais l'énoncé annonce la stack interne **Next.js + Vercel**. J'ai choisi **Next.js** pour coller à cette stack cible, tout en **répliquant fidèlement le design system** existant (tokens couleurs, Lexend, glassmorphism, relevés 1:1). _Choix assumé et signalé : si l'objectif était la réutilisation directe des composants Nuxt, on partirait sur Nuxt._

**Ne rien réinventer — librairies headless fiables.** Les primitives accessibles (dropdown, tooltip, dialog, popover, datepicker, form/validation) ne sont pas hand-rollées : on s'appuie sur des libs OSS solides et on les **habille au style S'investir 1:1**, en supprimant toute la plomberie a11y/clavier/focus/positionnement :

- **Radix UI** — `Select`, `Tooltip`, `Dialog`, `Popover` (chaque primitive centralisée dans **un** wrapper local).
- **react-day-picker** — le calendrier de la période (bande de sélection continue, presets, navigation mois/année, locale FR).
- **react-hook-form + zod** — état et validation du formulaire.
- **Floating UI** — les erreurs de validation flottantes.
- **Chart.js / react-chartjs-2** — les graphiques (fidèle à la suite S'investir).

**Composant portable.** Packagé `@sinvestir/crypto-simulator`, **`react` en `peerDependency`**. Il est stylé en **Tailwind v4** consommant le `@theme` partagé : l'hôte fournit le CSS Tailwind compilé (l'app le fait ; pour un embed externe, on livre le bundle CSS ou on passe par `/embed`). Runtime : Radix, react-day-picker, react-hook-form, @floating-ui, chart.js, decimal.js, html-to-image.

**Calcul exact et testé.** `simulate()` est une fonction pure (série de prix + paramètres → KPI + série temporelle), en **`decimal.js`** pour éviter la dérive flottante sur des centaines de divisions `montant / prix`. Couverte par des tests **Vitest** sur le comportement (DCA, achat unique, stablecoin ~0 %, période avant l'existence de l'actif, montant NaN, bornes invalides). Le boundary réseau est testé avec **MSW**.

**Données validées au boundary (zod).** Toute réponse réseau est parsée par un schéma zod ; un mismatch lève une `ContractError` (visibilité > acceptation silencieuse). Le mapping `snake_case → camelCase` se fait **une seule fois** côté serveur.

**Proxy avec cache — entorse assumée.** Ma règle par défaut est « frontend → backend direct, pas de proxy sans secret ». Ici je proxie la source via une **route API Next avec `revalidate`** : justifié par le **rate-limit** des API publiques (la démo ne doit pas casser) et documenté.

**Graphiques — le défaut source corrigé + 3 vues en plus.** La source affiche 4 séries écrasées sur un seul axe (illisible). Ici : sous-sélecteur **Courbe / Aire / Barres / Donut**. La courbe répartit les 3 séries en € et la série « Acquis » (unités) sur **deux axes Y**. Vue **Barres** = investi + plus-value empilés par année ; **Donut** = répartition investi / plus-value.

**UX & performance perçue (principes tenus partout).**

- **Zéro layout shift** : erreurs de validation **flottantes** (Floating UI, position absolue), jamais de bannière qui repousse le contenu ; skeletons dimensionnés au contenu final.
- **Delayed loading** : au changement de crypto, la donnée précédente reste affichée et le skeleton n'apparaît qu'au-delà de ~200 ms → un switch en cache swappe sans flash, un switch lent montre le skeleton (pas de donnée périmée).
- **Inputs filtrés** : un champ date/montant n'accepte que des caractères pertinents (composant `Input` à variants).
- **Never crash** : les parsers renvoient `NaN`/`null` plutôt que `throw` ; un `ErrorBoundary` racine (react-error-boundary) catche le reste et propose une fenêtre « Réessayer / Recharger ».

---

## Source de données

Le calcul DCA depuis 2018 nécessite un **historique de prix quotidien en EUR**. Contrainte : **l'API CoinGecko gratuite plafonne l'historique à 365 jours** (le full history est payant). La source `data/` est donc **abstraite derrière un `PriceProvider`**, sélectionnable par `CRYPTO_DATA_PROVIDER` :

| Provider            | `CRYPTO_DATA_PROVIDER` | Historique                        | EUR   | Coût                           |
| ------------------- | ---------------------- | --------------------------------- | ----- | ------------------------------ |
| **Fritzy** (défaut) | `fritzy`               | complet (2013+)                   | natif | gratuit (backend de la source) |
| **CoinGecko**       | `coingecko`            | 365 j sans clé / complet avec clé | natif | gratuit / payant               |

> La démo tourne par défaut sur **Fritzy** (le backend du simulateur d'origine), ce qui reproduit le scénario fidèle sans clé. **Pour la production**, S'investir basculerait sur un provider payant fiable en une variable d'env. Cf. [`IMPROVEMENTS.md`](./IMPROVEMENTS.md).

---

## Analytics (PostHog)

Analytics produit via **PostHog**, initialisé dans `app/providers.tsx`. Le trafic passe par un **reverse proxy** (`/ingest/*` → PostHog, réécrit dans `next.config.ts`) pour survivre aux bloqueurs de pub. Désactivé si la clé est absente.

| Variable                   | Défaut                     | Rôle                                  |
| -------------------------- | -------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`  | —                          | clé projet PostHog (publique, `phc_`) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | host d'ingestion (EU / US)            |

Copier `apps/web/.env.example` → `apps/web/.env.local` et renseigner la clé.

---

## Variables d'environnement

| Variable                   | Défaut   | Rôle                                                 |
| -------------------------- | -------- | ---------------------------------------------------- |
| `CRYPTO_DATA_PROVIDER`     | `fritzy` | `fritzy` \| `coingecko`                              |
| `COINGECKO_API_KEY`        | —        | débloque le full history sur le provider `coingecko` |
| `NEXT_PUBLIC_POSTHOG_KEY`  | —        | analytics PostHog (optionnel)                        |
| `NEXT_PUBLIC_POSTHOG_HOST` | EU       | host PostHog (EU / US)                               |

---

## Embarquer le simulateur

**Via iframe** (le plus simple, comme la source) :

```html
<iframe
  src="https://sinvestir.canot.dev/embed"
  width="100%"
  height="900"
  loading="lazy"
  style="border:0;border-radius:24px"
  title="Simulateur crypto S'investir"
></iframe>
```

**Via le composant React** (intégration dans la suite) :

```tsx
import { CryptoSimulator } from "@sinvestir/crypto-simulator";

<CryptoSimulator
  apiBaseUrl="/api"
  defaultCoinId="bitcoin"
  defaultFrequency="weekly"
/>;
```

L'hôte fournit les routes `/api/coins` et `/api/coins/[id]/history` (incluses dans `apps/web`) et le CSS Tailwind compilé.

---

## Déploiement

La démo ([sinvestir.canot.dev](https://sinvestir.canot.dev)) tourne sur un **VPS** derrière **Caddy** (reverse proxy, TLS Let's Encrypt automatique), packagée en image **Docker Next.js `standalone`**, avec **CI/CD GitHub Actions** : chaque push sur `main` déclenche rsync des sources → `docker compose up -d --build` → smoke test HTTPS. Cf. [`deploy/`](./deploy) et [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.yml up -d --build
```

**Alternative Vercel** (le code est prêt) : importer le repo — monorepo pnpm détecté, build `pnpm build`, output `apps/web`. Définir au besoin `CRYPTO_DATA_PROVIDER` / `COINGECKO_API_KEY` / `NEXT_PUBLIC_POSTHOG_KEY`.

---

## Suggestions d'amélioration pour S'investir

> **Q2 du rendu** — regard de partenaire, au-delà de ce POC. Backlog technique détaillé dans [`IMPROVEMENTS.md`](./IMPROVEMENTS.md).

**Stratégique**

- **Ré-internaliser le simulateur crypto.** L'actuel sur `sinvestir.fr` est un **widget tiers Fritzy** en iframe : hors charte, et surtout hors contrôle (données, SEO, tracking, UX). Ce POC prouve qu'on peut le reprendre en interne — charte 1:1, data maîtrisée, analytics first-party — comme 9ᵉ simulateur de la suite.
- **Combler le trou SEO `/les-simulateurs/crypto`** (aujourd'hui **404**). « Simulateur crypto » est un fort volume de recherche : une page maison **SSR + OpenGraph** capte ce trafic que l'iframe tierce ne référence pas.

**Produit / pédagogie**

- **DCA vs achat unique en surimpression** sur la même période — le message pédagogique le plus fort sur l'intérêt du DCA.
- **Pédagogie du risque crypto** : drawdown max sur la période, PRU vs prix actuel, sensibilité au timing (« et si vous aviez commencé X mois plus tôt/tard ? »).
- **Enregistrer / Partager** branchés sur les comptes de la suite (Supabase) — rétention et acquisition.

**Fiabilité / industrialisation**

- **Provider de données payant fiable** en production (CoinMarketCap / CoinGecko Analyst) : l'abstraction `PriceProvider` est déjà en place — un fichier + une variable d'env suffisent (cf. [Source de données](#source-de-données)).
- **Embed officiel** (Web Component) pour diffuser le simulateur depuis `sinvestir.fr` sans dépendance à l'hôte.
- **i18n FR/EN** + passe accessibilité (la source Fritzy est bilingue).

---

## Qualité

- **Tests** : `pnpm test` — logique DCA (Vitest) + contrat réseau (MSW).
- **Types** : `pnpm typecheck` — TS `strict` + `noUncheckedIndexedAccess`, zéro `as any`.
- **Revue** : [`GUIDELINES.md`](./GUIDELINES.md) + skill Claude Code **`/review`** qui vérifie la branche en mode strict.
- **Backlog & suggestions « regard de partenaire »** : [`IMPROVEMENTS.md`](./IMPROVEMENTS.md).
