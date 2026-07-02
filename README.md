# Simulateur crypto au format S'investir

Simulateur d'investissement crypto (DCA / plus-value), transposé au **design system de la suite `simulateurs.sinvestir.fr`** et livré comme **composant React autonome et embarquable**.

🎯 **Démo** : **https://sinvestir.canot.dev** / 🧩 **Embed** : [`/embed`](https://sinvestir.canot.dev/embed)

## L'approche

- **Le livrable demandé** : le simulateur crypto (DCA), utilisable seul sur [`/embed`](https://sinvestir.canot.dev/embed).
- **Le parti pris** : en voyant que le design system de la suite était accessible, j'ai poussé jusqu'au **clone 1:1** de l'interface S'investir (100 % identique) pour tester jusqu'où l'IA permet aujourd'hui une réplication fidèle et rapide. J'en ai profité pour corriger quelques bugs repérés sur l'original.

Sur le scénario par défaut (Bitcoin, 25 €/semaine depuis le 01/01/2018), le simulateur reproduit fidèlement la source : **Investi 11 100 €, Acquis ~0,794 ₿, PRU ~13 970 €, Capital final ~41 850 €, Performance ~+277 %**.

**Ce que le composant apporte vs le widget Fritzy actuel :**

- **Graphique lisible** : double-axe + 4 vues (courbe / aire / barres / donut) + légende masquable, là où la source écrase 4 séries sur un seul axe.
- **Chargement optimisé** : cache de la requête d'historique (route API Next), skeletons retardés (pas de flash), données triées (pas de glitch de courbe).
- **Robustesse** : zéro layout shift, never-crash (parsers tolérants + `ErrorBoundary`).
- **Intégrable proprement** : composant autonome, `/embed`, peu de dépendances.

---

## 📋 Rendu du test : les deux questions

### 1. Choix techniques / partis pris _(+ justification hors-stack)_

**Next.js** (stack annoncée) plutôt que Nuxt (suite existante) : choix assumé, design system répliqué 1:1. Logique DCA isolée en **fonction pure testée** (`decimal.js`, Vitest). **Rien réinventé** : Radix, react-day-picker, react-hook-form + zod, Floating UI, Chart.js, habillés au style S'investir. Composant **autonome / embarquable**, **données validées zod** au boundary réseau, proxy + cache assumé pour le rate-limit.

→ **Détail complet : [`docs/partis-pris.md`](./docs/partis-pris.md)**

### 2. Suggestions d'amélioration (problème détecté → solution)

Revue de l'existant (`sinvestir.fr` et `simulateurs.sinvestir.fr`) :

- **SEO** : la suite est rendue côté client (SPA, sitemap vide, 0 JSON-LD), les pages ne captent pas le SEO → rendu serveur (SSR/SSG, natif avec Next.js) + données structurées.
- **SEO-LLM / GEO** : le site principal bloque les crawlers IA (GPTBot, ClaudeBot, Google-Extended…) dans son `robots.txt`, donc non citable dans ChatGPT/Claude/Perplexity → débloquer + données structurées pour être cité.
- **Sécurité** : inscription sans confirmation d'email (un compte se crée avec une adresse jetable) → activer la confirmation (native Supabase Auth) ; vérifier les policies RLS sur l'accès Supabase direct ; ajouter les headers de sécurité manquants.
- **Performance** : le widget Fritzy actuel est lent (pas de cache) ; pages WordPress lourdes (~800 Ko + ~75 scripts) → internaliser un composant optimisé, alléger les assets.
- **UX** : copy « + de 7 000 cryptomonnaies » inexacte (~100 réels) → corriger.
- **Produit** (selon la vision produit) : DCA vs achat unique, indicateur de risque, light mode.

→ **Détail : [`IMPROVEMENTS.md`](./IMPROVEMENTS.md)**

---

## Démarche

1. **Contexte** : compréhension du test, scan des sites S'investir (design, tokens, composants), et rétro-ingénierie de la source. Le « simulateur crypto » actuel de S'investir n'est pas leur code : c'est un **widget tiers Fritzy** embarqué en iframe.
2. **Plan** : identifier ce qu'il faut répliquer (le design system, au pixel), la logique à reprendre (backtest DCA), et la donnée nécessaire (historique de prix quotidien en EUR).
3. **Réalisation** : moteur DCA pur et testé, UI clonée 1:1, app Next.js (démo + `/embed` + routes API), déploiement.
4. **Méthode** : piloté par mes instructions, en binôme avec l'IA (itérations rapides sur le design, les bugs et l'UX).

→ **Contexte & rétro-ingénierie détaillés : [`CONTEXTE-RAPPORT.md`](./CONTEXTE-RAPPORT.md)**

---

## Données

Le calcul DCA depuis 2018 demande un historique de prix quotidien en EUR.

- **CoinGecko** (que j'avais déjà utilisé sur un terminal de trading, dans une startup à Dubaï) est ici insuffisant en gratuit : historique plafonné à 365 jours + rate limit. Gardé en **repli**.
- **Fritzy** (le backend de la source) est utilisé **par défaut** : historique complet, sans clé.

L'exactitude des données Fritzy n'a pas été formellement vérifiée, mais l'architecture rend le **changement de source trivial** (abstraction `PriceProvider` : un fichier à ajouter + une variable d'env). Détail : [`docs/donnees.md`](./docs/donnees.md).

---

## Déploiement

Le code est **prêt pour Vercel** (la préférence du brief : import du repo, build `pnpm build`, output `apps/web`). Je l'ai déployé sur **mon propre VPS** parce que mon compte Vercel est déjà occupé par d'autres projets ; avec mon setup (Caddy + CI/CD GitHub Actions), un déploiement se résume à pointer un sous-domaine. J'utilise Vercel en production depuis plusieurs années pour le frontend.

→ **Détail : [`deploy/README.md`](./deploy/README.md)**

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

| Sujet                                       | Document                                         |
| ------------------------------------------- | ------------------------------------------------ |
| 🏗 Architecture (monorepo, couches)          | [`docs/architecture.md`](./docs/architecture.md) |
| 🧠 Choix techniques & partis pris _(Q1)_    | [`docs/partis-pris.md`](./docs/partis-pris.md)   |
| 🔌 Source de données & configuration        | [`docs/donnees.md`](./docs/donnees.md)           |
| 📊 Analytics (PostHog)                      | [`docs/analytics.md`](./docs/analytics.md)       |
| 🧩 Embarquer le simulateur                  | [`docs/embed.md`](./docs/embed.md)               |
| 🚀 Déploiement (VPS / Caddy / CI/CD)        | [`deploy/README.md`](./deploy/README.md)         |
| 💡 Suggestions pour S'investir _(Q2)_       | [`IMPROVEMENTS.md`](./IMPROVEMENTS.md)           |
| 🔎 Contexte & rétro-ingénierie de la source | [`CONTEXTE-RAPPORT.md`](./CONTEXTE-RAPPORT.md)   |
| 📐 Guidelines de code & revue               | [`GUIDELINES.md`](./GUIDELINES.md)               |

---

## Qualité

- **Tests** : `pnpm test`, logique DCA (Vitest) + contrat réseau (MSW).
- **Types** : `pnpm typecheck`, TS `strict` + `noUncheckedIndexedAccess`, zéro `as any`.
- **Revue** : [`GUIDELINES.md`](./GUIDELINES.md) + skill `/review` (branche vérifiée en mode strict).
