# Vidéo de présentation — étapes (Loom ~5 min)

> Juste le déroulé, étape par étape. Pas un script mot à mot — reste naturel.

### 1. Se présenter (20 s)

- Prénom, en une phrase qui tu es / ton profil.
- Le cadre : test technique S'investir, transposer le simulateur crypto au format de la suite.

### 2. Poser la mission (30 s)

- Le simulateur crypto actuel de S'investir est un **widget tiers Fritzy** embarqué en iframe, hors charte.
- Objectif : reprendre sa **logique DCA** et l'**habiller aux standards visuels** de `simulateurs.sinvestir.fr`, comme un 9ᵉ simulateur maison.

### 3. Démo live — le cœur (1 min 30)

- Ouvrir la démo. Scénario par défaut : **Bitcoin, 25 €/semaine, depuis 2018** → montrer **~+277 %** (fidèle à la source).
- Changer d'actif (ex. Ethereum) → tout se recalcule en temps réel, sans flash (donnée précédente gardée, skeleton seulement si ça charge).
- Modifier le montant, la fréquence.
- **Le date range picker** : ouvrir le calendrier, montrer les presets (1 an / 5 ans / Max), la sélection start→end, la saisie clavier synchronisée, l'impossibilité d'aller au-delà d'aujourd'hui.
- **Les 4 graphiques** : Courbe → Aire → Barres (par année) → Donut. Puis l'onglet **Calendrier**.
- **Responsive** : réduire la fenêtre → colonnes empilées.

### 4. Fidélité design (30 s)

- Comparer côte à côte avec un vrai simulateur S'investir (`/les-simulateurs/interets-composes`) : mêmes couleurs, Lexend, cartes vitrées, barre investi/plus-value, ⓘ tooltips, sidebar.
- Insister : **fidélité, pas copie** — mêmes tokens, composants répliqués.

### 5. Sous le capot — choix techniques (1 min)

- **Next.js** (stack annoncée) plutôt que Nuxt (suite existante) — choix assumé, design system répliqué 1:1.
- **Composant autonome & embarquable** : montrer `/embed` + le snippet iframe.
- **Ne rien réinventer** : Radix, react-day-picker, react-hook-form + zod, Floating UI — habillés au style S'investir.
- **Données** : logique DCA = fonction pure `simulate()` en decimal.js, **testée** ; API proxifiée + cache (rate-limit).
- Montrer vite `pnpm test` qui passe.

### 6. Le souci du détail / posture senior (40 s)

- **Zéro layout shift**, erreurs de validation **flottantes**, delayed loading, never-crash (error boundary).
- Correction d'un **défaut de la source** : le graphique écrasé sur un seul axe → double axe + 4 vues.

### 7. Regard de partenaire — suggestions (30 s)

- 2-3 pistes de `IMPROVEMENTS.md` : ré-internaliser le widget (supprimer la dépendance Fritzy), DCA vs achat unique côte à côte, SEO/SSR par simulateur, embed officiel.

### 8. Conclusion (10 s)

- Lien démo (**https://sinvestir.canot.dev**) + repo. Remercier.

> **Bonus si le temps le permet** (posture senior) : mentionner que la démo est
> déployée sur un VPS derrière Caddy avec **CI/CD GitHub Actions** (push `main`
> → build Docker + déploiement + smoke test), sans toucher aux autres projets en
> prod sur la machine. Montrer aussi la **sidebar repliable** (languette).
