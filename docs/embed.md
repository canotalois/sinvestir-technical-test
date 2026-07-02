# Embarquer le simulateur

**Via iframe** (le plus simple, comme la source) :

```html
<iframe
  src="https://sinvestir.canot.dev/embed"
  width="100%"
  height="900"
  loading="lazy"
  style="border:0;border-radius:24px"
  title="Simulateur crypto S'investir"
></iframe>
```

**Via le composant React** (intégration dans la suite) :

```tsx
import { CryptoSimulator } from "@sinvestir/crypto-simulator";

<CryptoSimulator
  apiBaseUrl="/api"
  defaultCoinId="bitcoin"
  defaultFrequency="weekly"
/>;
```

L'hôte fournit les routes `/api/coins` et `/api/coins/[id]/history` (incluses dans `apps/web`) et le CSS Tailwind compilé.
