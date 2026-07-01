/* eslint-disable */
/**
 * S'investir CSS scraper
 * ----------------------
 * Outil de relevé des styles RÉELS de simulateurs.sinvestir.fr, pour reproduire
 * le design system au pixel près sans deviner.
 *
 * Comment l'utiliser :
 *   1. Ouvrir une page S'investir dans Chrome (connecté), ex. un simulateur.
 *   2. Ouvrir la console DevTools (Cmd+Option+J).
 *   3. Coller TOUT le contenu de ce fichier, Entrée.
 *   4. Lancer une des commandes ci-dessous. Le résultat est affiché ET copié
 *      dans le presse-papier (quand `copy()` est dispo).
 *
 * Commandes :
 *   SI.bg()              -> pile de fond de la page (couleur de base + dégradés, par couche)
 *   SI.vars()            -> custom properties :root (couleurs, fontes, rayons, ombres)
 *   SI.colors()          -> couleurs Tailwind custom (blue-sky, blue-night, gold, ...) -> rgb
 *   SI.el('.selector')   -> styles calculés "utiles" du 1er élément qui matche
 *   SI.text('Un libellé')-> trouve l'élément qui contient ce texte exact et le décrit
 *   SI.shadows()         -> toutes les box-shadow distinctes en page (avec un exemple)
 *   SI.fonts()           -> familles + tailles de base
 *   SI.dump()            -> { bg, vars, colors, fonts } en un seul JSON
 *
 * Les URLs et e-mails sont masqués dans la sortie (pour partage sans fuite).
 */
(function () {
  const strip = (v) =>
    typeof v === "string"
      ? v
          .replace(/https?:\/\/[^\s"')]+/g, "<url>")
          .replace(/[\w.+-]+@[\w.-]+\.[\w.-]+/g, "<email>")
      : v;

  // Propriétés "qui comptent" pour reproduire un visuel (on ignore le bruit).
  const KEY_PROPS = [
    "display", "position", "top", "right", "bottom", "left", "zIndex",
    "width", "height", "minHeight", "maxWidth", "boxSizing",
    "margin", "padding", "gap", "flexDirection", "justifyContent", "alignItems",
    "gridTemplateColumns",
    "color", "backgroundColor", "backgroundImage", "opacity",
    "borderTopWidth", "borderStyle", "borderTopColor", "borderRadius",
    "boxShadow", "outline", "outlineOffset",
    "backdropFilter", "filter",
    "fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing",
    "textTransform", "textAlign",
  ];

  const NOISE = new Set([
    "none", "normal", "auto", "0px", "rgba(0, 0, 0, 0)", "static", "0",
    "rgb(0, 0, 0)", "block",
  ]);

  function describe(el) {
    if (!el) return null;
    const c = getComputedStyle(el);
    const o = {
      __tag: el.tagName.toLowerCase(),
      __class: strip((el.className || "").toString().slice(0, 80)),
    };
    for (const p of KEY_PROPS) {
      const v = c[p];
      if (v && !NOISE.has(v)) o[p] = strip(v);
    }
    return o;
  }

  function eachRule(cb) {
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (e) {
        continue; // feuille cross-origin
      }
      if (!rules) continue;
      const walk = (rs) => {
        for (const r of rs) {
          if (r.style) cb(r);
          if (r.cssRules) walk(r.cssRules);
        }
      };
      walk(rules);
    }
  }

  const isPainted = (c) =>
    c.backgroundColor !== "rgba(0, 0, 0, 0)" || c.backgroundImage !== "none";

  const SI = {
    /** 1er élément qui matche le sélecteur, décrit. */
    el(sel) {
      return describe(document.querySelector(sel));
    },

    /** Élément contenant exactement (ou à défaut incluant) ce texte. */
    text(t) {
      const all = [...document.querySelectorAll("*")];
      const el =
        all.find((e) => e.textContent.trim() === t && e.children.length <= 1) ||
        all.find((e) => e.textContent.includes(t) && e.children.length <= 2);
      return describe(el);
    },

    /** Pile de fond : documentElement, body, et tout wrapper ~plein écran qui peint un fond. */
    bg() {
      const layers = [];
      const seen = new Set();
      const nodes = [document.documentElement, document.body];
      document.body
        .querySelectorAll("div, main, section")
        .forEach((e) => {
          const r = e.getBoundingClientRect();
          if (r.width >= window.innerWidth * 0.95 && r.height >= window.innerHeight * 0.8)
            nodes.push(e);
        });
      for (const el of nodes) {
        if (!el || seen.has(el)) continue;
        seen.add(el);
        const c = getComputedStyle(el);
        if (isPainted(c)) {
          layers.push({
            tag: el.tagName.toLowerCase(),
            class: strip((el.className || "").toString().slice(0, 60)),
            backgroundColor: c.backgroundColor,
            backgroundImage: strip(c.backgroundImage),
          });
        }
      }
      return layers;
    },

    /** Custom properties déclarées sur :root (couleurs/fontes/rayons/ombres). */
    vars() {
      const out = {};
      eachRule((r) => {
        if (r.selectorText && /(^|,)\s*:root\b/.test(r.selectorText)) {
          for (let i = 0; i < r.style.length; i++) {
            const p = r.style[i];
            if (p.startsWith("--")) {
              const v = r.style.getPropertyValue(p).trim();
              if (v && !/url\(|https?:/i.test(v) && !(p in out)) out[p] = strip(v);
            }
          }
        }
      });
      return out;
    },

    /** Couleurs custom Tailwind (bg/text/border/from/to/via-<nom>) -> valeur résolue. */
    colors() {
      const out = {};
      const re = /^\.(?:bg|text|border|from|to|via|fill|stroke|ring)-([a-z][a-z0-9-]*)(?:\\\/\d+)?(?:::?[a-z-]+)?$/;
      eachRule((r) => {
        const sel = r.selectorText;
        if (!sel) return;
        for (const part of sel.split(",")) {
          const m = part.trim().match(re);
          if (!m) continue;
          const v =
            r.style.backgroundColor ||
            r.style.color ||
            r.style.borderColor ||
            r.style.fill ||
            r.style.getPropertyValue("--tw-gradient-from");
          if (v && /(rgb|#|oklch|hsl)/i.test(v) && !/var\(/.test(v)) {
            const name = m[1];
            if (!(name in out)) out[name] = v;
          }
        }
      });
      return out;
    },

    /** box-shadow distinctes utilisées en page (avec un sélecteur d'exemple). */
    shadows() {
      const out = {};
      eachRule((r) => {
        const s = r.style.boxShadow;
        if (s && s !== "none" && !(s in out)) out[s] = (r.selectorText || "").slice(0, 50);
      });
      return out;
    },

    fonts() {
      const c = getComputedStyle(document.body);
      return { family: c.fontFamily, baseSize: c.fontSize };
    },

    /** Tout en un. Copié dans le presse-papier si possible. */
    dump() {
      const data = {
        path: location.pathname,
        bg: this.bg(),
        fonts: this.fonts(),
        colors: this.colors(),
        vars: this.vars(),
      };
      const json = JSON.stringify(data, null, 2);
      console.log(json);
      try {
        // `copy` n'existe que dans la console DevTools
        // eslint-disable-next-line no-undef
        copy(json);
        console.log("%c✓ copié dans le presse-papier", "color:#1098F7");
      } catch (e) {
        /* hors console : on ignore */
      }
      return data;
    },
  };

  window.SI = SI;
  console.log(
    "%cS’investir CSS scraper prêt — SI.bg() · SI.vars() · SI.colors() · SI.el(sel) · SI.text(txt) · SI.shadows() · SI.dump()",
    "color:#1098F7;font-weight:bold",
  );
  return SI;
})();
