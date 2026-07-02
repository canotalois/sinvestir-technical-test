# Améliorations & suggestions pour S'investir

Revue d'optimisation de l'existant (`sinvestir.fr` et `simulateurs.sinvestir.fr`). Format : problème constaté → suggestion.

## SEO

- **Suite rendue côté client** (`data-ssr="false"`, HTML initial ~4 Ko, aucun JSON-LD), contenu quasi invisible pour un crawler → SSR/prerender (natif Nuxt) + données structurées (`SoftwareApplication`, `FAQPage`).
- **Soft-404 sur `/les-simulateurs/crypto`** (HTTP 200 renvoyant une page « 404 » client) → servir un vrai statut 404, ou la page.

## SEO-LLM / GEO

- **Le site principal bloque les crawlers IA** dans son `robots.txt` (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Bytespider, meta-externalagent), donc absent de ChatGPT/Claude/Perplexity et des AI Overviews → réévaluer ce blocage pour être cité sur les requêtes finance.
- **Aucun contenu citable côté suite** (SPA vide, pas de JSON-LD, pas de `llms.txt` réel) → le SSR et les données structurées rendent les simulateurs référençables et citables.

## Sécurité

- **Supabase appelé en direct depuis le client** (clé anon publique) : la sécurité repose entièrement sur les policies RLS → auditer que RLS est activé avec des policies par utilisateur sur les tables sensibles ; passer écritures et opérations sensibles par une API/edge function ; ne jamais exposer la `service_role`.
- **Headers de sécurité absents sur la suite** (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ; côté site principal, CSP limitée à `upgrade-insecure-requests`) → les ajouter (config Vercel/Next).

## Performance

- **`sinvestir.fr` lourd** : accueil ~800 Ko de HTML + ~75 scripts, page crypto ~560 Ko → optimiser les images, lazy-load, réduire les scripts.
- **Suite sans SSR** : écran blanc avant le chargement du JS → le SSR améliore aussi la performance perçue.

## UX / UI

- **Page 404 sans habillage** (ni logo, ni navigation, ni liens) → y mettre logo, navigation et liens vers les simulateurs.
- **Copy « + de 7 000 cryptomonnaies »** sur la page crypto alors que le widget en propose une centaine → corriger le chiffre.
- **Graphique du widget crypto** : 4 séries écrasées sur un seul axe, illisible → double-axe + plusieurs vues (fait dans ce POC).

## Produit (selon la vision produit)

- DCA vs achat unique sur la même période.
- Indicateur de risque : drawdown, prix de revient vs prix actuel.
- Curseur de timing, sélecteur de plage (brush).
- Light mode en plus du dark.

## Déjà livré dans ce POC

- Recherche d'actif (combobox), vue Calendrier, 4 graphiques lisibles (double-axe + légende masquable), tri de l'historique de prix, never-crash, zéro layout shift.
