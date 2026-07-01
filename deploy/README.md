# Déploiement

Le simulateur est déployé comme conteneur autonome derrière le reverse proxy
**Caddy** partagé du VPS (TLS automatique via Let's Encrypt). Le conteneur
n'expose **aucun port** sur l'hôte : Caddy le joint par son nom de conteneur
sur le réseau docker dédié `sinvestir-net`.

## Prérequis

- Docker + Docker Compose sur l'hôte.
- Un enregistrement DNS `A sinvestir.canot.dev → <IP du VPS>`.
- Un reverse proxy Caddy déjà en place détenant `:80/:443`.

## Variables d'environnement (build)

Les clés `NEXT_PUBLIC_*` sont injectées au build (inlinées dans le bundle,
publiques par nature). Créer un fichier `deploy/.env` :

```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Déployer / mettre à jour

```bash
docker compose --env-file deploy/.env -f deploy/docker-compose.yml up -d --build
```

## Brancher au reverse proxy (une seule fois)

Rattacher Caddy au réseau du simulateur (opération à chaud, non-disruptive) :

```bash
docker network connect sinvestir-net <conteneur-caddy>
```

Puis ajouter le bloc suivant au `Caddyfile` et recharger
(`docker exec <conteneur-caddy> caddy reload --config /etc/caddy/Caddyfile`) :

```
sinvestir.canot.dev {
    encode zstd gzip
    reverse_proxy sinvestir-simulateur:3000
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }
}
```

> Pas de `X-Frame-Options` : le simulateur (`/embed`) doit rester intégrable en
> iframe sur un site tiers.
