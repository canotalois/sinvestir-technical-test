# Backlog d'améliorations (phase 2)

Périmètre **volontairement écarté de la phase 1** (reproduction fidèle). Trié par rapport valeur/effort.

## Produit / UX

- [x] **Vue « Calendrier »** (livré) : table année/mois des versements cumulés, unités acquises et valeur.
- [ ] **DCA vs achat unique en surimpression** : comparer les deux stratégies sur la même période (message pédagogique fort).
- [ ] **Sensibilité au timing** : « et si vous aviez commencé X mois plus tôt/tard ? » en un clic.
- [ ] **PRU vs prix actuel** (badge) + **drawdown max** sur la période (pédagogie du risque crypto).
- [ ] **Sélecteur de plage temporelle (brush)** sous le graphique, comme la source Fritzy.
- [ ] **Recherche dans le sélecteur d'actifs** + icônes des coins (la source a un dropdown recherchable).
- [ ] **Boutons « Enregistrer / Partager »** branchés sur les comptes de la suite (Supabase) — aujourd'hui hors périmètre composant.

## Graphique

- [x] **Sélecteur de type de graphique** (livré : Courbe / Aire / Barres / Donut).
- [x] **Double-axe + séries désactivables** via la légende (livré) ; reste : bascule unités/€.
- [x] **Légende interactive** (livré) ; reste : tooltips enrichis (variation %, date exacte).

## Données / fiabilité

- [ ] **Provider payant** : ajouter `CoinMarketCap` ($79/mois, EUR natif, historique 2013+) ou activer `CoinGecko Analyst` ($129/mois) pour s'affranchir du proxy Fritzy. L'abstraction `PriceProvider` est déjà en place : un seul fichier à ajouter + `CRYPTO_DATA_PROVIDER=…`.
- [ ] **Repli FX gratuit** : Binance klines (USDT) + conversion EUR/USD (série BCE) en région Vercel EU.
- [ ] Persistance/cache long terme des séries (Supabase / KV) pour réduire les appels upstream.

## Qualité / tech

- [ ] **Tests de rendu** du composant (Testing Library) : états loading/error, recalcul sur changement d'input.
- [ ] **Passe accessibilité** : focus visible, navigation clavier du dropdown, `aria-live` sur les KPI.
- [ ] **i18n EN/FR** (la source Fritzy est bilingue ; `ember-intl` côté source).
- [ ] **Build de publication** du package (`tsup`) + types `.d.ts` pour un vrai `npm publish` (aujourd'hui consommé en TS source via `transpilePackages`).
- [ ] **Web Component** wrapper pour un embed framework-agnostic (zéro dépendance hôte).
- [ ] ESLint flat config + CI (lint/typecheck/test sur PR).

## SEO (si intégré à la suite Nuxt)

- [ ] Métadonnées / OpenGraph par simulateur, SSR des pages (gros volume de recherche « simulateur crypto »).
