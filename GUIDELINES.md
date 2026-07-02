# Guidelines : Simulateur crypto S'investir

Checklist courte. Chaque ligne `❌` est un **don't** = bloquant. Si tu te surprends à le faire, stoppe et reconsidère avant de commit.

En cas de doute : **throw early, type strictly, trust the layer below.** Pas de code défensif pour des cas que la couche d'en dessous a promis de ne pas produire.

> Adapté de mes guidelines frontend au périmètre de ce projet (composant simulateur réutilisable, Next.js + monorepo pnpm). Le skill `/review` (`.claude/skills/review`) vérifie cette branche contre ce fichier en mode strict.

## TypeScript

- ❌ Pas de `as` pour caster de la donnée `unknown`. Valide (guard custom, **zod**), puis narrow.
- ❌ Pas de body de réponse typé `Record<string, string>` ou `any`. Définis le contrat.
- ❌ Pas de cast `FormData.get()` / `URLSearchParams.get()` / `localStorage.getItem()` en `string`. Ils renvoient `string | null`. Narrow.
- ❌ Pas de `!` (non-null assertion) hors `array[0]!` garanti par une longueur/regex. Si tu as besoin de `!`, écris un guard.
- ❌ Pas du même état domaine encodé dans 2+ booléens (`isLoading` + `hasData` + `error`). Union discriminée avec un champ `status`.
- ❌ Ne désactive pas `strict` ni `noUncheckedIndexedAccess`. Ils sont ON. Ils restent ON.
- ✅ Les types wire-format vivent dans **un** fichier par boundary (`data/contracts.ts`). L'API CoinGecko renvoie du `snake_case` → on le valide et on le **mappe une seule fois** vers nos types camelCase.

## Nullish & fallbacks (`??`, `||`, `?.`)

- ❌ Pas de `??` pour masquer un contrat indécis (`data.x ?? data.X`). Choisis-en un et throw sur l'autre.
- ❌ Pas de `??` pour inventer un défaut domaine qui devrait être une vraie décision.
- ❌ Pas d'optional chaining `cb?.()` partout quand la prop est "optionnelle". Donne un `noop` par défaut à la construction et retire le `?.`.
- ✅ `??` OK pour un vrai défaut de config optionnelle (`apiBaseUrl ?? "/api"`). Documente **pourquoi** ce défaut.
- ✅ Préfère `throw` au fallback silencieux quand la valeur est requise pour fonctionner.

## Errors

- ❌ Pas de `throw new Error(message)` pour une erreur domaine. Classe d'erreur typée avec un `code` discriminé.
- ❌ Pas de `catch (err) {}` ni `.catch(() => undefined)`. Au minimum log. Mieux : classifie.
- ❌ Pas de fallbacks empilés entre couches. Une fois que tu fais confiance au site de throw, la 2e couche est inutile.
- ✅ Une classe d'erreur par domaine (`ContractError` au boundary réseau, `SimulationError` pour la logique DCA) avec un `code` que l'UI peut switcher.
- ✅ Parse les réponses d'erreur **au boundary**, pas au call site.

## React

- ❌ Pas de `router.push` / `setState` pendant le render. Utilise `useEffect`.
- ❌ Pas de `'use client'` en haut d'une page server-renderable. Isole les îlots client (le simulateur EST un îlot client : un seul `'use client'` à sa racine).
- ❌ Pas d'objet frais passé à `<Context.Provider value={…}>` à chaque render. `useMemo`.
- ❌ Pas de logique dérivable mise en `useState` + `useEffect`. Dérive pendant le render.
- ✅ Les effets décrivent une **synchronisation** (fetch CoinGecko, debounce). Cleanup si async/subscription.
- ✅ Les calculs (la simulation DCA) sont des **fonctions pures** hors composant, mémoïsées avec `useMemo` sur leurs entrées.

## Network & contracts

- ❌ Pas d'acceptation de plusieurs shapes "au cas où". Le contrat est le contrat.
- ❌ Pas de chemins `/api/...` en dur dans les composants/hooks. Centralise dans `data/client.ts`.
- ✅ Valide la shape de réponse **au boundary** avec zod. Throw `ContractError` sur mismatch (visibilité > acceptation silencieuse).
- ✅ Les env vars requises throw au chargement du module, pas de fallback silencieux vers `''`.
- ✅ **Exception assumée à la règle "frontend → backend direct"** : on proxie CoinGecko via une route API Next **avec cache** (`revalidate`). Justification : rate-limit de l'API publique → la démo ne doit pas casser. C'est le seul proxy autorisé, et il est documenté dans le README.

## Packages (monorepo)

- ❌ Pas de `react`/`react-dom` dans les `dependencies` d'une lib. **Uniquement** `peerDependencies`.
- ❌ Pas de deps browser-only enfouies dans un package partagé sans adapter.
- ❌ Pas de deep import dans `src/` d'un autre package. Passe par la map `exports`.
- ✅ `@sinvestir/crypto-simulator` est **autonome** : zéro dépendance à Next, au routing, ou à l'app hôte. Il reçoit ses données via props/callbacks.
- ✅ Une seule version de chaque dep dans le monorepo.

## UI & Design system

- ❌ Pas de couleur, spacing ou radius **en dur** dans le JSX. Utilise les utilitaires Tailwind adossés au thème (`@theme` de `apps/web/app/globals.css`) : `text-blue-sky`, `bg-white/5`, `rounded-card`…
- ❌ Pas de hex/rgb littéral dans un composant. Si une couleur manque, ajoute un token dans `@theme`. Pour un `style` inline complexe et rare (lueur, ombre verre), référence un token via `var(--color-*)` / `color-mix(...)`, jamais un hex.
- ❌ Pas de nouveau composant UI sans vérifier d'abord ce qui existe dans `@sinvestir/crypto-simulator`.
- ❌ Pas de primitive accessible réinventée à la main (dropdown, tooltip, dialog, popover, datepicker). Utilise une lib headless fiable (**Radix UI**, **react-day-picker**) et applique le style 1:1 par-dessus. On ne re-crée jamais ce qu'une lib OSS fiable fournit déjà.
- ❌ Pas d'import d'une lib UI éparpillé dans plusieurs fichiers. **Un seul fichier wrapper par primitive** (alias `*Primitive`, ex. `SelectPrimitive`), le reste de la codebase consomme le wrapper local.
- ✅ **Atomicité** : extrais les patterns répétés en primitives réutilisables (`Input` à variants `text`/`numeric`/`date`, `StatsRow`, hooks data `useCoins`/`usePriceHistory`). Réutilise, ne duplique pas.
- ✅ **Tailwind v4 partout** + thème partagé (un seul système, classes relevées 1:1 sur S'investir). L'app scanne le package via `@source` dans `globals.css`.
- ✅ Embarquabilité : le package n'impose pas de config Tailwind à l'hôte mais suppose le CSS Tailwind compilé chargé (l'app le fait ; pour un embed externe, livrer le bundle CSS). À documenter dans le README.
- ✅ Chart.js (canvas) lit ses couleurs depuis `@sinvestir/tokens` (valeurs TS, alignées avec le `@theme`), jamais des littéraux épars.

## UX & performance perçue

- ❌ **Aucun layout shift.** Pas d'UI qui repousse le contenu pour afficher une erreur/un état : erreur flottante ancrée au champ (react-hook-form + Floating UI) ou espace réservé, jamais une bannière qui décale. Un skeleton doit avoir **exactement** les dimensions du contenu final (sinon shift au swap).
- ❌ Pas de skeleton qui **flash** sur un chargement rapide/en cache (« delayed loading indicator ») : garde la donnée précédente visible et n'affiche le skeleton qu'au-delà de ~200 ms. Un fetch en cache doit swapper direct, sans skeleton.
- ❌ Pas de donnée périmée affichée sous un nouveau label (ex. anciens prix sous une nouvelle crypto) : au-delà du seuil, montre le skeleton, pas le stale.
- ❌ Pas d'input qui accepte des caractères hors-domaine (lettres dans une date ou un montant). Filtre via le composant `Input` à variants.
- ❌ Jamais crasher sur une entrée mal formée : les parsers renvoient `NaN`/`null` (pas de `throw`), l'UI affiche un message. Un `ErrorBoundary` racine catche le reste.
- ✅ Vérifie **en live dans le navigateur** : zéro shift, flicker, flash, ni donnée périmée.

## Tests

- ❌ Pas seulement le happy path. Teste le comportement subtil (one-shot vs DCA, stablecoin ~0 %, date avant l'existence de l'actif, période < 1 fréquence).
- ❌ Pas de test contre tes propres mocks d'un contrat non spécifié. Matche le contrat réel CoinGecko (`snake_case`, `{prices:[[ts,price]]}`).
- ✅ **Vitest** + **MSW** pour le réseau, adapters mémoire sinon.
- ✅ Un test par **comportement**, pas par fonction. Nomme le comportement dans le `it()`.

## Commits & PR hygiene

- ❌ Pas 16k lignes en 2 commits. Commits atomiques, un changement logique chacun.
- ❌ Pas de `--no-verify` ni `--no-gpg-sign`.
- ✅ Description de PR : scope, test plan, screenshots si UI.
- ✅ Commits propres avant push.
</content>
