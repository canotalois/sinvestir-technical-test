# Améliorations & suggestions pour S'investir

Revue d'optimisation de l'existant (`sinvestir.fr` et `simulateurs.sinvestir.fr`). Format : problème constaté → suggestion.

## SEO

- **Suite rendue côté client** (`data-ssr="false"`, HTML initial ~4 Ko, aucun JSON-LD, sitemap vide) : les pages ne captent pas le SEO. Un rendu serveur (SSR/SSG, natif avec Next.js) + données structurées (`SoftwareApplication`, `FAQPage`) les rendraient référençables, ce qui va dans le sens d'une volonté de visibilité (présence YouTube, etc.).

## SEO-LLM / GEO

- **Le site principal bloque les crawlers IA** dans son `robots.txt` (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, Bytespider, meta-externalagent) : non citable dans ChatGPT, Claude, Perplexity → débloquer et ajouter des données structurées pour être cité sur les requêtes finance.

## Sécurité

- **Inscription sans confirmation d'email** : un compte se crée avec une adresse jetable (constaté). Activer la confirmation d'email, qui est un réglage natif de Supabase Auth.
- **Supabase appelé en direct depuis le client** (clé anon publique) : vérifier que RLS est activé avec des policies par utilisateur sur les tables sensibles, sinon la clé anon permet de lire toutes les lignes via l'endpoint REST.
- **Headers de sécurité absents sur la suite** (CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) → les ajouter (config Vercel/Next).

## Performance

- **Le widget crypto Fritzy est lent** : composant tiers sans cache de la requête d'historique. L'internaliser (ce POC) permet de mettre la donnée en cache et d'optimiser le rendu.
- **`sinvestir.fr` lourd** : accueil ~800 Ko de HTML + ~75 scripts, page crypto ~560 Ko → optimiser les images, lazy-load, réduire les scripts.

## UX / UI

- **Copy « + de 7 000 cryptomonnaies »** sur la page crypto alors que le widget en propose une centaine → corriger le chiffre.

## Produit (selon la vision produit)

- DCA vs achat unique sur la même période.
- Indicateur de risque : drawdown, prix de revient vs prix actuel.
- Curseur de timing, sélecteur de plage (brush).
- Light mode en plus du dark.

## Déjà livré dans ce POC

- Recherche d'actif (combobox), vue Calendrier, 4 graphiques lisibles (double-axe + légende masquable), tri de l'historique de prix, never-crash, zéro layout shift.
