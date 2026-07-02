# Source de données & configuration

## Providers

Le calcul DCA depuis 2018 nécessite un **historique de prix quotidien en EUR**. Contrainte : **l'API CoinGecko gratuite plafonne l'historique à 365 jours** (le full history est payant). La source `data/` est donc **abstraite derrière un `PriceProvider`**, sélectionnable par `CRYPTO_DATA_PROVIDER` :

| Provider            | `CRYPTO_DATA_PROVIDER` | Historique                        | EUR   | Coût                           |
| ------------------- | ---------------------- | --------------------------------- | ----- | ------------------------------ |
| **Fritzy** (défaut) | `fritzy`               | complet (2013+)                   | natif | gratuit (backend de la source) |
| **CoinGecko**       | `coingecko`            | 365 j sans clé / complet avec clé | natif | gratuit / payant               |

> La démo tourne par défaut sur **Fritzy** (le backend du simulateur d'origine), ce qui reproduit le scénario fidèle sans clé. **Pour la production**, S'investir basculerait sur un provider payant fiable en une variable d'env. Cf. [`IMPROVEMENTS.md`](../IMPROVEMENTS.md).

## Variables d'environnement

| Variable                   | Défaut   | Rôle                                                              |
| -------------------------- | -------- | ----------------------------------------------------------------- |
| `CRYPTO_DATA_PROVIDER`     | `fritzy` | `fritzy` \| `coingecko`                                           |
| `COINGECKO_API_KEY`        | —        | débloque le full history sur le provider `coingecko`              |
| `NEXT_PUBLIC_POSTHOG_KEY`  | —        | analytics PostHog (optionnel, cf. [analytics.md](./analytics.md)) |
| `NEXT_PUBLIC_POSTHOG_HOST` | EU       | host PostHog (EU / US)                                            |

Aucune variable n'est requise pour lancer la démo en local (le provider Fritzy par défaut ne nécessite pas de clé).
