# Analytics (PostHog)

Analytics produit via **PostHog**, initialisé dans `app/providers.tsx`. Le trafic passe par un **reverse proxy** (`/ingest/*` → PostHog, réécrit dans `next.config.ts`) pour survivre aux bloqueurs de pub. Désactivé si la clé est absente.

| Variable                   | Défaut                     | Rôle                                  |
| -------------------------- | -------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`  | -                          | clé projet PostHog (publique, `phc_`) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | host d'ingestion (EU / US)            |

Copier `apps/web/.env.example` → `apps/web/.env.local` et renseigner la clé.
