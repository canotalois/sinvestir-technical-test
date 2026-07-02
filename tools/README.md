# Outils de relevé CSS pour S'investir

Reproduire le design system de `simulateurs.sinvestir.fr` **au pixel près**, sans
deviner : on relève les styles **réels** depuis le site en production.

## `scrape-css.js`

Snippet à coller dans la console DevTools (la page S'investir exige une session
connectée, c'est pour ça qu'on passe par le navigateur plutôt qu'un scraper
Node headless, qui n'aurait pas le cookie de session).

### Utilisation

1. Ouvrir une page S'investir dans Chrome (connecté), ex. un simulateur.
2. Console DevTools : `Cmd+Option+J`.
3. Copier-coller **tout** `scrape-css.js`, Entrée → `SI` est prêt.
4. Lancer une commande. Le résultat s'affiche **et** est copié dans le presse-papier.

### Commandes

| Commande             | Renvoie                                                                                |
| -------------------- | -------------------------------------------------------------------------------------- |
| `SI.bg()`            | Pile de fond de la page (couleur de base + dégradés), couche par couche                |
| `SI.vars()`          | Les `--custom-properties` de `:root` (couleurs, fontes, rayons, ombres)                |
| `SI.colors()`        | Les couleurs Tailwind custom (`blue-sky`, `blue-night`, `gold`, …) résolues en `rgb()` |
| `SI.el('.sel')`      | Styles calculés « utiles » du 1ᵉʳ élément qui matche                                   |
| `SI.text('Libellé')` | Trouve l'élément contenant ce texte et le décrit                                       |
| `SI.shadows()`       | Toutes les `box-shadow` distinctes de la page                                          |
| `SI.fonts()`         | Familles + taille de base                                                              |
| `SI.dump()`          | Tout (`bg`, `vars`, `colors`, `fonts`) en un seul JSON                                 |

Les URLs et e-mails sont masqués dans la sortie (partage sans fuite).

### Exemple

```js
SI.bg();
// [
//   { tag: "body", class: "...", backgroundColor: "rgb(...)", backgroundImage: "radial-gradient(...)" },
//   ...
// ]

SI.text("Capital final");
// { __tag: "div", fontSize: "14px", fontWeight: "400", color: "rgb(255, 255, 255)", ... }
```

## Méthode de reconstruction

On reconstruit **surface par surface**, et on valide chaque étape avant de
passer à la suivante :

1. `body` + background
2. layout / shell (sidebar, header)
3. en-tête (titre, sous-titre, description)
4. formulaire (champs, labels, unités)
5. résultats (cartes, barre, valeurs)
6. dropdown / select
7. graphique

Chaque couleur/taille/ombre posée dans le code doit correspondre à une valeur
**relevée** via `scrape-css.js`, pas devinée.
