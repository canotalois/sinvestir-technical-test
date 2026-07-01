import { CryptoSimulator } from "@sinvestir/crypto-simulator";
import { Shell } from "./components/Shell";

export default function HomePage() {
  return (
    <Shell>
      <CryptoSimulator />
    </Shell>
  );
}
