# Test technique S'investir - Dossier de contexte & plan d'attaque

> **Mission :** transposer le simulateur crypto (DCA / plus-value) au format de la suite de simulateurs S'investir, et livrer une démo en ligne fonctionnelle.
> **Deadline :** mercredi **1ᵉʳ juillet 2026, 23h59** (l'email dit « mardi 1er juillet » - erreur, le 1ᵉʳ juillet 2026 est un **mercredi** ; le Notion fait foi). Aujourd'hui : dimanche 28/06 → **~3 jours**.
> **Charge visée :** une demi-journée. On ne juge pas un produit fini mais **du code propre + une démo qui marche**.
> **Rendu :** formulaire Tally `https://tally.so/r/81E2lA` → lien démo (Vercel de préférence) + repo Git + partis pris + suggestions d'amélioration + (bonus) Loom 5 min.

---

## 1. TL;DR (le projet en 10 lignes)

- Le « simulateur crypto » de S'investir n'est **pas leur code** : c'est un **widget tiers Fritzy** embarqué en iframe sur `sinvestir.fr/simulateur-crypto-monnaie/` (app réelle : `simulator.fritzy.finance/savings/crypto`).
- Sa **logique fonctionnelle** = un backtest **DCA** : on investit un montant fixe à une fréquence donnée sur une crypto entre deux dates, à partir de l'**historique de prix quotidien CoinGecko** (proxifié par Fritzy). Sorties : Investi, Acquis, Prix moyen d'acquisition, Capital final, Performance + un graphique historique.
- La **cible design** `simulateurs.sinvestir.fr` est la vraie suite maison : **thème dark navy « glassmorphism »**, police **Lexend**, accents **bleu royal + or**, cartes vitrées, graphiques **Chart.js**. Stack réelle : **Nuxt 3 (Vue) + Tailwind, déployée sur Vercel**.
- Il **n'existe aucun simulateur crypto** dans la suite (`/les-simulateurs/crypto` → 404). La transposition vient donc **combler un trou réel** : ce serait le 9ᵉ simulateur, à l'URL `/les-simulateurs/crypto`.
- ⚠️ **Point stratégique :** la stack _annoncée_ dans le test est **Next.js**, mais la suite _existante_ est **Nuxt**. Choix de techno à assumer et justifier dans le README (voir §6 et §9).

---

## 2. La mission, reformulée précisément

> Reprendre la **logique fonctionnelle** du simulateur crypto Fritzy et l'**habiller aux standards visuels** de `simulateurs.sinvestir.fr`, comme s'il rejoignait la suite.

Critères d'évaluation annoncés :

1. **Démo fonctionnelle** manipulable (le cœur).
2. **Fidélité au design** S'investir (couleurs, typo, composants, esprit).
3. **Qualité & intégrabilité du code** (compatible avec leur stack, ou choix justifié) ; composant **autonome, embarquable, peu de dépendances**, pensé pour (a) remplacer le simulateur actuel dans la suite et (b) bonus : être **embeddé** depuis `sinvestir.fr`.
4. **Responsive** desktop + mobile.
5. **README minimal** : lancer le projet + partis pris.
6. **Bonus « regard de partenaire »** : suggestions d'amélioration sur l'existant (voir §8).

---

## 3. Le simulateur SOURCE (Fritzy) - spec fonctionnelle complète

### 3.1 Où il vit

- Page marketing WordPress : `https://sinvestir.fr/simulateur-crypto-monnaie/` - landing SEO + iframe.
- Embed via `iframe-integration.js` (script `id="fritzy-simulator"`, `data-simulator="saving-digital-asset"`), chargé en lazy-load (WP Rocket).
- App réelle : **`https://simulator.fritzy.finance/savings/crypto?embedded=true`** (titre interne : « Épargne d'actif numérique »).
- Resize de l'iframe via **iframe-resizer** (postMessage parent ↔ iframe).

### 3.2 Entrées (panneau « Simulation »)

| Champ               | Type                   | Valeur par défaut        | Détail                                                                                                                                                                        |
| ------------------- | ---------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actif numérique** | dropdown recherchable  | - (« Choisir un actif ») | **Top 100 cryptos** par market cap (Bitcoin, Ethereum, Tether, BNB, USDC, XRP, Solana…). Le « 7000 cryptos » de la page marketing est **faux** : le widget propose 100 coins. |
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
| **Performance**              | %        | `+277,33 %` (vert si +, rouge si −) | `(Capital final − Investi) / Investi × 100` |

> ✅ Recalcul vérifié à la main : 25 € × 443 sem = 11 075 € ; (41 788 − 11 075)/11 075 = +277 %.

### 3.4 Graphique (panneau « Historique »)

- 4 séries temporelles, légende : **Acquis** (jaune), **Investi** (violet), **Prix** (gris), **Valeur** (aire bleu clair).
- **Slider de plage temporelle** (brush) pour zoomer sur une sous-période.
- Séries jour par jour : `Investi(t)`, `cumUnits(t)`, `Valeur(t)=cumUnits(t)×P(t)`, `Prix(t)=P(t)`.
- Graphiques d'origine en **amCharts4** (confirmé via le repo Fritzy).
- ⚠️ **Faiblesse UX observée** : dans l'iframe embeddée le graphique s'affiche quasi-vide/plat. Cause probable : « Acquis » est en **unités crypto** (0,79) tracé sur le **même axe Y** que des montants en **€** (jusqu'à ~52 000) → tout est écrasé. → opportunité d'amélioration (voir §8).

### 3.5 Données & API (le cœur à reproduire)

Backend `digital-assets.fritzy.finance` = **proxy CoinGecko** :

1. `GET /coins/list` → coins supportés.
2. `GET /coins/markets?vs_currency=usd` → **top 100** `{id, symbol, name, marketCapRank}` → alimente le dropdown.
3. `GET /coins/{id}/market_chart?vs_currency=EUR&days=3650` → **historique de prix quotidien en EUR** sur ~10 ans, format CoinGecko `{ "prices": [[timestamp_ms, prix_eur], …] }` (pas/jour = 86 400 000 ms). Déclenché à la sélection d'un actif.

- Prix récupérés en **EUR** (cohérent avec l'affichage €), market list en USD.
- Le param `days` semble **ignoré** par le proxy (un `days=10` renvoie quand même l'historique depuis 2013) → Fritzy sert vraisemblablement un **dataset complet en cache** (anti rate-limit CoinGecko).
- **Tout le calcul DCA est fait côté client** à partir de cette série de prix.

### 3.6 Stack technique du widget source

- **Ember.js 3.28 (Octane)** SPA - assets `vendor-*.js`, `chunk.*.js`, `fz-front-simulator-*.js`, `manifest.webmanifest`, `translations/fr.json`.
- i18n **ember-intl** (FR/EN), UI **ember-bootstrap**, graphiques **amCharts4**, `ember-power-select` (le dropdown).
- Repo public : `gitlab.com/fritzy/front/fz-front-simulator` - monorepo Yarn workspaces, package **`@fritzy/simulator-embedded`** (vocation white-label/embarquable).

---

## 4. La CIBLE design (`simulateurs.sinvestir.fr`) - design system

### 4.1 Stack réelle de la suite

- **Nuxt 3 (Vue)** - scripts `/_nuxt/*.js`, page 404 « …| Nuxt ».
- **Tailwind CSS** - design tokens en variables CSS `--color-*` au format RGB espacé (signature Tailwind).
- Hébergée sur **Vercel** (`/_vercel/insights/script.js`).
- Analytics **Microsoft Clarity** ; formulaires **Tally** (« Faire une suggestion ») - _même outil que le formulaire de rendu du test_.
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
| `--blur`                   | -                    | **12px**               | glassmorphism (backdrop-blur)      |
| accent bleu CTA            | -                    | ~**#2563EB**           | boutons primaires                  |
| accent **or** S'investir   | -                    | ~**#E8B339 / #F5C84E** | logo S', séries de graphes, barres |
| dégradé de graphe          | -                    | **#2945A8**            | aire bleu royal des charts         |
| bordure d'input            | rgba(120,153,206,.3) | **#7899CE @30%**       | underline des champs               |

### 4.3 Typographie

- **Lexend** partout (corps ET titres). Pas de serif : les titres « élégants » sont du Lexend **light, UPPERCASE, letter-spacé**.
- Titres de simulateur : centrés, en capitales, encadrés de **petits traits horizontaux** décoratifs (« - SIMULATEUR INTÉRÊTS COMPOSÉS - »), sous-titre bleu, paragraphe muted.

### 4.4 Layout & composants (réf. : `/les-simulateurs/interets-composes`)

- **Sidebar gauche** sombre, arrondie : profil (avatar + email), nav (Tableau de bord, Les simulateurs, Les comparateurs, Mes simulations, Formation offerte), bas (Gérer mon compte, Faire une suggestion, **Déconnexion** en bouton bleu). Collapsible (chevron `‹`).
- **Header** : logo « S' SIMULATEURS » + lien « Découvrir S'investir ».
- **Callout pédagogique** : encadré bleu arrondi, icône ⓘ (« vocation pédagogique, pas un conseil… »). À reprendre tel quel pour la crypto (disclaimer de risque crypto).
- **Deux colonnes** : inputs (gauche) / **« Vos résultats »** (droite).
- **Inputs** : style **underline transparent**, label + tooltip ⓘ, **suffixe d'unité** à droite (EUR / % / ANNÉES), gros texte blanc (20px), bordure basse bleu pâle.
- **Cartes résultats** : vitrées sombres arrondies, gros chiffre, libellé muted, **barre de progression empilée bleu + or**, carte « phrase de synthèse ».
- **Actions** : **« Enregistrer la simulation »** (pill bleu plein) + **« Partager mes résultats »** (pill blanc/outline). Compte requis pour sauvegarder/partager.
- **Visualisation** : toggle segmenté **« Graphiques | Calendrier »**, puis sélecteur **« Type de graphique »** (ligne/aire, barres, donut). Graphe = **aire à dégradé bleu royal**, axe « Montant € », points terminaux colorés, multi-séries (bleu + or + bleu clair). Bouton « Voir notre vidéo tuto » (pill bleu, icône play).

### 4.5 L'écosystème suite (pour situer)

- **25 326+ inscrits, 40k+ simulations, 8 simulateurs + 8 comparateurs.**
- Simulateurs existants : intérêts composés, inflation, impact des frais, crédit immobilier, F.I.R.E, coût par ordre (PEA), S'investir Conseil vs CGP, financement véhicule.
- Comparateurs : PEA, CTO, assurance-vie, PER, SCPI, **Crypto** (plateformes), banque en ligne (×2), ETF (bientôt).
- **Il y a déjà un _comparateur_ crypto, mais aucun _simulateur_ crypto** → la transposition s'insère naturellement comme 9ᵉ simulateur (`/les-simulateurs/crypto`, aujourd'hui 404).

---

## 5. Mapping de transposition source → cible

| Source Fritzy                               | → Cible S'investir                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| Panneau « Simulation » (header jaune)       | Colonne inputs gauche, style underline + tooltips ⓘ + suffixes                    |
| Dropdown actif (top 100)                    | `<select>` recherchable, fond glass dark, items Lexend                            |
| Montant / Fréquence / Depuis / Jusqu'au     | mêmes champs, unités à droite (€, dates)                                          |
| Panneau « Chiffres clés » (5 KPI)           | Cartes résultats vitrées « Vos résultats » + barre Investi/Plus-value bleu+or     |
| Graphique « Historique » (4 séries + brush) | Chart.js aire dégradé bleu royal, toggle Graphiques/Calendrier, axe « Montant € » |
| (rien)                                      | + Disclaimer crypto dans le callout bleu ⓘ                                        |
| (rien)                                      | + Boutons Enregistrer / Partager (au moins maquettés)                             |

KPI à mapper : **Investi**, **Acquis** (unités), **Prix moyen d'acquisition (PRU)**, **Capital final**, **Performance %** - réutiliser la logique de barre « part investie / part plus-value » comme pour « somme investie / intérêts gagnés ».

---

## 6. Contraintes stack & intégration

- **Stack interne annoncée :** Next.js, Supabase, Vercel, n8n, Claude Code ; outils HubSpot, WooCommerce, Google Sheets.
- **Réalité de la suite :** Nuxt 3 + Tailwind + Vercel. → **divergence Next.js (annoncé) vs Nuxt (existant)**.
- **Deux options défendables**, à trancher et justifier dans le README :
  - **A - Next.js** : colle à la _stack annoncée_ et à la consigne « déployez sur Vercel ». Permet de montrer qu'on sait construire un composant autonome ré-embeddable. Coût : on ré-implémente le design system (pas de réutilisation directe du code Nuxt).
  - **B - Nuxt** : colle à la _suite existante_, réutilise directement leurs composants/tokens → fidélité visuelle maximale et intégration « drop-in » la plus crédible. Coût : s'éloigne du mot « Next.js » de la consigne.
  - 👉 **Recommandation : A (Next.js)**, en l'assumant explicitement : « la consigne cite Next.js et Vercel ; je livre un composant React autonome, mais j'ai répliqué fidèlement le design system Nuxt/Tailwind existant (mêmes tokens) pour qu'il s'intègre visuellement ». Ça transforme la divergence en **signal positif** (capacité à choisir _et_ expliquer, exactement ce qu'ils valorisent).
- **Intégrabilité demandée** : composant **autonome, peu de dépendances, embarquable** (iframe + éventuellement Web Component / script d'embed à la Fritzy). Pas besoin d'intégrer réellement chez eux : il faut **montrer que c'est conçu pour**.
- **Données** : réutiliser CoinGecko (`/coins/markets`, `/coins/{id}/market_chart?vs_currency=eur`) directement, ou un petit proxy (route API Next pour cacher la clé / gérer le rate-limit / cacher la réponse). CoinGecko a une API publique gratuite avec rate-limit → un cache léger (route handler + revalidate) est le bon réflexe à montrer.

---

## 7. Contexte entreprise (synthèse, voir détails sourcés en annexe)

- **S'investir** = média d'éducation financière (bourse, ETF, gestion passive) + cabinet de conseil patrimonial (S'investir Conseil). Fondé fin 2019 par **Matthieu Louvet**.
- **Matthieu Louvet** : ex-**ingénieur en IA** (ISAE-SUPAERO), **CIF/CGP** régulé (ORIAS / ANACOFI-CIF). Approche « evidence-based », chiffrée - d'où l'appétence pour les simulateurs. ~**390k abonnés YouTube**, Trustpilot **4,9/5**.
- **Entités** : SAS « Matthieu Louvet - S'investir » (média/formation, Toulouse) ; « S'investir Conseil » (cabinet CIF/CGP, Toulouse + Aix-en-Provence).
- **Les vraies missions** (pas les simulateurs) : **outils internes, agents IA, automatisations** - facturation interne, analyse de patrimoine, dashboards de pilotage, intégrations HubSpot/WooCommerce/Sheets. Le simulateur n'est qu'un **test calibré** pour juger le niveau.
- **Implication pour le rendu** : public = grand public investisseur particulier ; ton pédagogique, rigoureux, transparent sur le risque. La **conformité** (disclaimers, « pas un conseil ») compte pour un acteur régulé.

---

## 8. « Regard de partenaire » - suggestions d'amélioration (le bonus)

Pistes concrètes à proposer dans le formulaire (mélange quick-wins + vision) :

**Sur le simulateur crypto lui-même**

1. **Corriger le graphique** : séparer la série « Acquis » (unités) des séries en € (double axe Y, ou onglet dédié). Aujourd'hui il s'affiche écrasé/illisible en embed.
2. **DCA vs one-shot côte à côte** : afficher en surimpression la perf d'un investissement unique au début vs le DCA → message pédagogique fort (le simulateur le permet déjà conceptuellement, pas visuellement).
3. **« Et si vous aviez commencé X mois plus tôt/tard »** : sensibilité au timing, en un clic.
4. **PRU vs prix actuel** badge + **drawdown max** sur la période (pédagogie du risque/volatilité crypto).

**Sur la suite (cohérence produit)** 5. **Unifier la techno** : le simulateur crypto est un **iframe Fritzy tiers** hors charte ; le ré-internaliser dans la suite Nuxt supprime une dépendance externe, une marque tierce visible et un point de rupture UX/SEO. (C'est exactement ce que le test prototype.) 6. **Embed officiel** : fournir un script `<script data-simulator="crypto">` maison (comme Fritzy) pour ré-embarquer n'importe quel simulateur dans les articles de blog `sinvestir.fr` → cohérence de marque + acquisition. 7. **SEO** : les pages simulateurs sont des SPA ; soigner le SSR/meta/OG par simulateur (Nuxt le permet) pour capter le trafic « simulateur X » (gros volume).

**Sur le terrain des « vraies missions » (montrer qu'on a lu entre les lignes)** 8. Esquisser comment un **agent IA** + **n8n** pourraient générer automatiquement un **rapport patrimonial** à partir des simulations sauvegardées (Supabase) et les pousser dans **HubSpot** comme signal commercial pour S'investir Conseil → lien direct entre l'outil gratuit et la conversion conseil.

---

## 9. Plan d'implémentation proposé (pour tenir la demi-journée)

**Techno :** Next.js (App Router) + TypeScript + Tailwind, déployé sur Vercel. Graphes : Recharts ou Chart.js (Chart.js = fidélité à l'existant). Composant packagé comme **`<CryptoSimulator />`** autonome.

1. **Setup (30 min)** - `create-next-app`, Tailwind, tokens S'investir (les `--color-*` ci-dessus en `tailwind.config` / `globals.css`), police Lexend (next/font).
2. **Données (45 min)** - route API `/api/coins` (markets, top 100) + `/api/coins/[id]/history?vs=eur` (proxy + cache `revalidate`). Fallback : appel direct CoinGecko côté client si on veut zéro backend.
3. **Logique DCA (45 min)** - fonction pure `simulate({prices, montant, frequence, depuis, jusquau})` → `{investi, acquis, pru, capitalFinal, performance, series[]}`. **Testée** (un petit test unitaire = signal qualité fort vu leur exigence « code propre »).
4. **UI (1h30)** - layout 2 colonnes + cartes résultats + callout disclaimer, au design S'investir (sidebar simplifiée/optionnelle en mode embed). Champs underline + suffixes + tooltips.
5. **Graphique (45 min)** - aire dégradé bleu royal + or, toggle Graphiques/Calendrier, **double axe** (correction du défaut source).
6. **Responsive + embed (30 min)** - colonnes empilées en mobile ; page `/embed` minimaliste (sans sidebar) + snippet d'intégration documenté.
7. **README + déploiement + Loom (30 min)** - partis pris (dont Next vs Nuxt), `npm run dev`, lien Vercel, vidéo 5 min.

**Définition de « fini » :** un BTC 25€/sem 2018→2026 affiche ~+277 % comme la source ✔, responsive ✔, déployé ✔, README ✔.

---

## 10. Risques / points d'attention / questions ouvertes

- **Rate-limit CoinGecko** : prévoir cache + gestion d'erreur (sinon démo qui casse le jour J). Fritzy contourne via dataset caché - répliquer un cache minimal.
- **Cohérence des devises** : prix en **EUR** (`vs_currency=eur`) pour matcher l'affichage €.
- **Edge cases** : date de début avant l'existence de la crypto ; période < 1 fréquence ; stablecoins (USDT/USDC ~ perf nulle, bon cas de test) ; montant non numérique.
- **Symbole d'unité** : « ₿ » pour BTC - gérer un symbole/format générique par coin.
- **Fidélité ≠ copie** : on reproduit _l'esprit_ (tokens, composants), on ne pille pas le code Nuxt propriétaire.
- **À confirmer côté S'investir si l'occasion se présente** : faut-il viser Next ou rester sur leur Nuxt ? (Le README tranche par défaut, mais le mentionner montre la posture partenaire.)

---

## Annexe - sources de contexte (lecture seule)

- Simulateur source : `sinvestir.fr/simulateur-crypto-monnaie/` → `simulator.fritzy.finance/savings/crypto`
- Données : `digital-assets.fritzy.finance/coins/{list,markets,{id}/market_chart}` (proxy CoinGecko)
- Cible design : `simulateurs.sinvestir.fr` (Nuxt/Tailwind/Vercel) ; réf. `/les-simulateurs/interets-composes`
- Repo Fritzy : `gitlab.com/fritzy/front/fz-front-simulator` (Ember 3.28, amCharts4, `@fritzy/simulator-embedded`)
- Entreprise : `sinvestir.fr`, `sinvestir.fr/matthieu-louvet-a-propos`, societe.com / annuaire-entreprises (SIREN 909 440 570), Trustpilot, YouTube @MatthieuLouvet
- Rendu : `tally.so/r/81E2lA`
</content>

</invoke>
