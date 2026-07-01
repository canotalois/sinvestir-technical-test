import { CryptoSimulator } from "@sinvestir/crypto-simulator";

/**
 * Minimal "embed" view (no sidebar or header) meant to be loaded
 * inside an <iframe> from any site (e.g. sinvestir.fr).
 */
export default function EmbedPage() {
  return <CryptoSimulator />;
}
