# syntax=docker/dockerfile:1

# ---- Builder: install workspace deps and compile the Next.js standalone bundle ----
FROM node:22-alpine AS builder
RUN corepack enable
WORKDIR /app

# PostHog keys are inlined at build time (NEXT_PUBLIC_* are public by design).
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
    NEXT_TELEMETRY_DISABLED=1

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @sinvestir/web build

# ---- Runner: copy only the standalone output, run as an unprivileged user ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
