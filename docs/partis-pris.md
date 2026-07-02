# Choix techniques & partis pris

> Réponse détaillée à la **Q1 du rendu** - le raisonnement derrière chaque décision, dont la justification du choix hors-stack (Next.js).

**Next.js plutôt que Nuxt.** La suite existante `simulateurs.sinvestir.fr` est en **Nuxt 3** - mais l'énoncé annonce la stack interne **Next.js + Vercel**. J'ai choisi **Next.js** pour coller à cette stack cible, tout en **répliquant fidèlement le design system** existant (tokens couleurs, Lexend, glassmorphism, relevés 1:1). _Choix assumé et signalé : si l'objectif était la réutilisation directe des composants Nuxt, on partirait sur Nuxt._

**Ne rien réinventer - librairies headless fiables.** Les primitives accessibles (dropdown, tooltip, dialog, popover, datepicker, form/validation) ne sont pas hand-rollées : on s'appuie sur des libs OSS solides et on les **habille au style S'investir 1:1**, en supprimant toute la plomberie a11y/clavier/focus/positionnement :

- **Radix UI** - `Select`, `Tooltip`, `Dialog`, `Popover` (chaque primitive centralisée dans **un** wrapper local).
- **react-day-picker** - le calendrier de la période (bande de sélection continue, presets, navigation mois/année, locale FR).
- **react-hook-form + zod** - état et validation du formulaire.
- **Floating UI** - les erreurs de validation flottantes.
- **Chart.js / react-chartjs-2** - les graphiques (fidèle à la suite S'investir).

**Composant portable.** Packagé `@sinvestir/crypto-simulator`, **`react` en `peerDependency`**. Il est stylé en **Tailwind v4** consommant le `@theme` partagé : l'hôte fournit le CSS Tailwind compilé (l'app le fait ; pour un embed externe, on livre le bundle CSS ou on passe par `/embed`). Runtime : Radix, react-day-picker, react-hook-form, @floating-ui, chart.js, decimal.js, html-to-image.

**Calcul exact et testé.** `simulate()` est une fonction pure (série de prix + paramètres → KPI + série temporelle), en **`decimal.js`** pour éviter la dérive flottante sur des centaines de divisions `montant / prix`. Couverte par des tests **Vitest** sur le comportement (DCA, achat unique, stablecoin ~0 %, période avant l'existence de l'actif, montant NaN, bornes invalides). Le boundary réseau est testé avec **MSW**.

**Données validées au boundary (zod).** Toute réponse réseau est parsée par un schéma zod ; un mismatch lève une `ContractError` (visibilité > acceptation silencieuse). Le mapping `snake_case → camelCase` se fait **une seule fois** côté serveur.

**Proxy avec cache - entorse assumée.** Ma règle par défaut est « frontend → backend direct, pas de proxy sans secret ». Ici je proxie la source via une **route API Next avec `revalidate`** : justifié par le **rate-limit** des API publiques (la démo ne doit pas casser) et documenté.

**Graphiques - le défaut source corrigé + 3 vues en plus.** La source affiche 4 séries écrasées sur un seul axe (illisible). Ici : sous-sélecteur **Courbe / Aire / Barres / Donut**. La courbe répartit les 3 séries en € et la série « Acquis » (unités) sur **deux axes Y**. Vue **Barres** = investi + plus-value empilés par année ; **Donut** = répartition investi / plus-value.

**UX & performance perçue (principes tenus partout).**

- **Zéro layout shift** : erreurs de validation **flottantes** (Floating UI, position absolue), jamais de bannière qui repousse le contenu ; skeletons dimensionnés au contenu final.
- **Delayed loading** : au changement de crypto, la donnée précédente reste affichée et le skeleton n'apparaît qu'au-delà de ~200 ms → un switch en cache swappe sans flash, un switch lent montre le skeleton (pas de donnée périmée).
- **Inputs filtrés** : un champ date/montant n'accepte que des caractères pertinents (composant `Input` à variants).
- **Never crash** : les parsers renvoient `NaN`/`null` plutôt que `throw` ; un `ErrorBoundary` racine (react-error-boundary) catche le reste et propose une fenêtre « Réessayer / Recharger ».
