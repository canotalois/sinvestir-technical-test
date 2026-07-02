# Architecture

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

**Couches** : `core` (calcul pur) → `data` (contrat réseau validé) → `ui` (présentation) → `apps/web` (intégration + données). Chaque couche fait confiance à celle du dessous (cf. [`GUIDELINES.md`](../GUIDELINES.md)).
