# Contexte & rétro-ingénierie de la source

> Mission : transposer le simulateur crypto (DCA / plus-value) au format de la suite de simulateurs S'investir, et livrer une démo en ligne fonctionnelle. Ce document rassemble la rétro-ingénierie de la source et le relevé du design cible qui ont guidé la réplication.

---

## 1. Vue d'ensemble

- Le « simulateur crypto » de S'investir n'est pas leur code : c'est un **widget tiers Fritzy** embarqué en iframe sur `sinvestir.fr/simulateur-crypto-monnaie/` (app réelle : `simulator.fritzy.finance/savings/crypto`).
- Sa **logique fonctionnelle** est un backtest **DCA** : on investit un montant fixe à une fréquence donnée sur une crypto entre deux dates, à partir de l'**historique de prix quotidien CoinGecko** (proxifié par Fritzy). Sorties : Investi, Acquis, Prix moyen d'acquisition, Capital final, Performance, plus un graphique historique.
- La **cible design** `simulateurs.sinvestir.fr` est la suite maison : **thème dark navy « glassmorphism »**, police **Lexend**, accents **bleu royal + or**, cartes vitrées, graphiques **Chart.js**. Stack de la suite : **Nuxt 3 (Vue) + Tailwind, sur Vercel**.
- Il n'existe **aucun simulateur crypto** dans la suite (`/les-simulateurs/crypto` renvoie une page 404) : la transposition s'insère naturellement comme 9ᵉ simulateur.

Note : d'après le brief, les missions réelles ne portent pas sur les simulateurs (outils internes, agents IA, automatisations) ; ce simulateur est un test calibré pour évaluer le niveau.

---

## 2. Mission & critères d'évaluation

> Reprendre la logique fonctionnelle du simulateur crypto Fritzy et l'habiller aux standards visuels de `simulateurs.sinvestir.fr`, comme s'il rejoignait la suite.

1. **Démo fonctionnelle** manipulable (le cœur).
2. **Fidélité au design** S'investir (couleurs, typo, composants, esprit).
3. **Qualité & intégrabilité du code** : composant autonome, embarquable, peu de dépendances, pensé pour remplacer le simulateur actuel et (bonus) être embeddé depuis `sinvestir.fr`.
4. **Responsive** desktop + mobile.
5. **README minimal** : lancer le projet + partis pris.
6. **Bonus « regard de partenaire »** : suggestions d'amélioration (voir [`IMPROVEMENTS.md`](./IMPROVEMENTS.md)).

---

## 3. Le simulateur source (Fritzy)

### 3.1 Où il vit

- Page marketing WordPress `sinvestir.fr/simulateur-crypto-monnaie/` : landing SEO + iframe.
- Embed via `iframe-integration.js` (script `id="fritzy-simulator"`, `data-simulator="saving-digital-asset"`), chargé en lazy-load (WP Rocket).
- App réelle : `simulator.fritzy.finance/savings/crypto?embedded=true` (titre interne : « Épargne d'actif numérique »).
- Resize de l'iframe via **iframe-resizer** (postMessage parent ↔ iframe).

### 3.2 Entrées (panneau « Simulation »)

| Champ               | Type                   | Valeur par défaut        | Détail                                                                                                                                                                        |
| ------------------- | ---------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actif numérique** | dropdown recherchable  | (« Choisir un actif »)   | **Top 100 cryptos** par market cap (Bitcoin, Ethereum, Tether, BNB, USDC, XRP, Solana…). Le « 7000 cryptos » de la page marketing est **faux** : le widget propose 100 coins. |
| **Montant**         | input texte, suffixe € | `25 €`                   | montant investi par période                                                                                                                                                   |
| **Fréquence**       | dropdown               | `Par semaine`            | **Une fois / Par jour / Par semaine / Par mois**                                                                                                                              |
| **Depuis**          | date                   | `01/01/2018`             | début de période                                                                                                                                                              |
| **Jusqu'au**        | date                   | aujourd'hui              | fin de période                                                                                                                                                                |

### 3.3 Sorties (panneau « Chiffres clés »)

| Indicateur                   | Icône    | Exemple (BTC, 25€/sem, 2018→2026)   | Formule                                     |
| ---------------------------- | -------- | ----------------------------------- | ------------------------------------------- |
| **Investi**                  | tirelire | `11 075,00 € en 443 semaines`       | `montant × nb_périodes`                     |
| **Acquis**                   | pièces   | `0,79400746 ₿`                      | `Σ (montant / prix_à_la_date)`              |
| **Prix moyen d'acquisition** | pièce    | `13 948,23 €`                       | `Investi / Acquis` (PRU)                    |
| **Capital final**            | sac      | `41 788,75 €`                       | `Acquis × prix_final`                       |
| **Performance**              | %        | `+277,33 %` (vert si positif)       | `(Capital final - Investi) / Investi × 100` |

> Recalcul vérifié à la main : 25 € × 443 sem = 11 075 € ; (41 788 - 11 075) / 11 075 = +277 %.

### 3.4 Graphique (panneau « Historique »)

- 4 séries temporelles, légende : **Acquis** (jaune), **Investi** (violet), **Prix** (gris), **Valeur** (aire bleu clair).
- **Slider de plage temporelle** (brush) pour zoomer sur une sous-période.
- Séries jour par jour : `Investi(t)`, `cumUnits(t)`, `Valeur(t) = cumUnits(t) × P(t)`, `Prix(t) = P(t)`.
- Graphiques d'origine en **amCharts4** (confirmé via le repo Fritzy).
- **Faiblesse UX observée** : dans l'iframe embeddée le graphique s'affiche quasi-vide/plat. Cause probable : « Acquis » est en **unités crypto** (0,79) tracé sur le **même axe Y** que des montants en **€** (jusqu'à ~52 000), donc tout est écrasé. C'est l'opportunité d'amélioration reprise dans le POC (double axe + vues multiples).

### 3.5 Données & API (le cœur à reproduire)

Backend `digital-assets.fritzy.finance`, un **proxy CoinGecko** :

1. `GET /coins/list` : coins supportés.
2. `GET /coins/markets?vs_currency=usd` : **top 100** `{id, symbol, name, marketCapRank}`, alimente le dropdown.
3. `GET /coins/{id}/market_chart?vs_currency=EUR&days=3650` : **historique de prix quotidien en EUR** sur ~10 ans, format CoinGecko `{ "prices": [[timestamp_ms, prix_eur], …] }` (pas/jour = 86 400 000 ms). Déclenché à la sélection d'un actif.

- Prix récupérés en **EUR** (cohérent avec l'affichage €), market list en USD.
- Le param `days` semble **ignoré** par le proxy (un `days=10` renvoie quand même l'historique depuis 2013) : Fritzy sert vraisemblablement un **dataset complet en cache** (anti rate-limit CoinGecko).
- **Tout le calcul DCA est fait côté client** à partir de cette série de prix.

### 3.6 Stack technique du widget source

- **Ember.js 3.28 (Octane)** SPA : assets `vendor-*.js`, `chunk.*.js`, `fz-front-simulator-*.js`, `manifest.webmanifest`, `translations/fr.json`.
- i18n **ember-intl** (FR/EN), UI **ember-bootstrap**, graphiques **amCharts4**, `ember-power-select` (le dropdown).
- Repo public `gitlab.com/fritzy/front/fz-front-simulator` : monorepo Yarn workspaces, package **`@fritzy/simulator-embedded`** (vocation white-label / embarquable).

---

## 4. La cible design (`simulateurs.sinvestir.fr`)

### 4.1 Stack de la suite

- **Nuxt 3 (Vue)** : scripts `/_nuxt/*.js`, page 404 « …| Nuxt ».
- **Tailwind CSS** : design tokens en variables CSS `--color-*` au format RGB espacé (signature Tailwind).
- Hébergée sur **Vercel** (`/_vercel/insights/script.js`).
- Analytics **Microsoft Clarity** ; formulaires **Tally** (« Faire une suggestion »), le même outil que le formulaire de rendu du test.
- Graphiques en **Chart.js** (canvas).

### 4.2 Tokens de couleur (extraits du `:root`)

| Token                      | RGB                  | Hex                    | Usage                              |
| -------------------------- | -------------------- | ---------------------- | ---------------------------------- |
| `--color-surface`          | 8 12 22              | **#080C16**            | fond principal (navy quasi-noir)   |
| `--color-surface-soft`     | 15 23 42             | **#0F172A**            | surfaces (slate-900)               |
| `--color-surface-elevated` | 0 23 63              | **#00173F**            | cartes élevées (bleu profond)      |
| `--color-text`             | 255 255 255          | **#FFFFFF**            | texte                              |
| `--color-text-muted`       | 156 163 175          | **#9CA3AF**            | texte secondaire (gray-400)        |
| `--color-ring`             | 16 152 247           | **#1098F7**            | accent / focus (bleu vif)          |
| `--blur`                   | (n/a)                | **12px**               | glassmorphism (backdrop-blur)      |
| accent bleu CTA            | (n/a)                | ~**#2563EB**           | boutons primaires                  |
| accent **or** S'investir   | (n/a)                | ~**#E8B339 / #F5C84E** | logo S', séries de graphes, barres |
| dégradé de graphe          | (n/a)                | **#2945A8**            | aire bleu royal des charts         |
| bordure d'input            | rgba(120,153,206,.3) | **#7899CE @30%**       | underline des champs               |

### 4.3 Typographie

- **Lexend** partout (corps ET titres). Pas de serif : les titres « élégants » sont du Lexend **light, UPPERCASE, letter-spacé**.
- Titres de simulateur : centrés, en capitales, encadrés de **petits traits horizontaux** décoratifs, sous-titre bleu, paragraphe muted.

### 4.4 Layout & composants (réf. `/les-simulateurs/interets-composes`)

- **Sidebar gauche** sombre, arrondie : profil (avatar + email), nav (Tableau de bord, Les simulateurs, Les comparateurs, Mes simulations, Formation offerte), bas (Gérer mon compte, Faire une suggestion, **Déconnexion** en bouton bleu). Collapsible (chevron).
- **Header** : logo « S' SIMULATEURS » + lien « Découvrir S'investir ».
- **Callout pédagogique** : encadré bleu arrondi, icône ⓘ. À reprendre pour la crypto (disclaimer de risque).
- **Deux colonnes** : inputs (gauche) / **« Vos résultats »** (droite).
- **Inputs** : style **underline transparent**, label + tooltip ⓘ, **suffixe d'unité** à droite (EUR / % / ANNÉES), gros texte blanc (20px), bordure basse bleu pâle.
- **Cartes résultats** : vitrées sombres arrondies, gros chiffre, libellé muted, **barre de progression empilée bleu + or**, carte « phrase de synthèse ».
- **Actions** : **« Enregistrer la simulation »** (pill bleu plein) + **« Partager mes résultats »** (pill blanc/outline). Compte requis pour sauvegarder/partager.
- **Visualisation** : toggle segmenté **« Graphiques | Calendrier »**, puis sélecteur **« Type de graphique »** (ligne/aire, barres, donut). Graphe = aire à dégradé bleu royal, axe « Montant € », multi-séries. Bouton « Voir notre vidéo tuto ».

### 4.5 L'écosystème suite (pour situer)

- **25 326+ inscrits, 40k+ simulations, 8 simulateurs + 8 comparateurs.**
- Simulateurs existants : intérêts composés, inflation, impact des frais, crédit immobilier, F.I.R.E, coût par ordre (PEA), S'investir Conseil vs CGP, financement véhicule.
- Comparateurs : PEA, CTO, assurance-vie, PER, SCPI, **Crypto** (plateformes), banque en ligne, ETF (bientôt).
- Il y a déjà un **comparateur** crypto, mais aucun **simulateur** crypto : la transposition s'insère comme 9ᵉ simulateur.

---

## 5. Mapping de transposition source → cible

| Source Fritzy                               | → Cible S'investir                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| Panneau « Simulation » (header jaune)       | Colonne inputs gauche, style underline + tooltips ⓘ + suffixes                    |
| Dropdown actif (top 100)                    | Combobox recherchable, fond glass dark, items Lexend                              |
| Montant / Fréquence / Depuis / Jusqu'au     | mêmes champs, unités à droite (€, dates)                                          |
| Panneau « Chiffres clés » (5 KPI)           | Cartes résultats vitrées « Vos résultats » + barre Investi/Plus-value bleu+or     |
| Graphique « Historique » (4 séries + brush) | Chart.js aire dégradé bleu royal, toggle Graphiques/Calendrier, axe « Montant € » |
| (rien)                                      | + Disclaimer crypto dans le callout bleu ⓘ                                        |
| (rien)                                      | + Boutons Enregistrer / Partager (maquettés)                                      |

KPI à mapper : **Investi**, **Acquis** (unités), **Prix moyen d'acquisition (PRU)**, **Capital final**, **Performance %**, en réutilisant la barre « part investie / part plus-value » comme la suite le fait pour « somme investie / intérêts gagnés ».

---

## Annexe : sources

- Simulateur source : `sinvestir.fr/simulateur-crypto-monnaie/` → `simulator.fritzy.finance/savings/crypto`
- Données : `digital-assets.fritzy.finance/coins/{list,markets,{id}/market_chart}` (proxy CoinGecko)
- Cible design : `simulateurs.sinvestir.fr` (Nuxt/Tailwind/Vercel), réf. `/les-simulateurs/interets-composes`
- Repo Fritzy : `gitlab.com/fritzy/front/fz-front-simulator` (Ember 3.28, amCharts4, `@fritzy/simulator-embedded`)
