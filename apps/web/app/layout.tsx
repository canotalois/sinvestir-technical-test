import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lexend } from "next/font/google";
import { PostHogProvider } from "./providers";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

// SEO calqué sur le vrai site (simulateurs.sinvestir.fr) : même suffixe de
// marque, favicon SVG, structure Open Graph / Twitter. Contenu adapté à cette
// page (le simulateur crypto DCA) plutôt qu'au hub complet.
const TITLE = "Simulateur crypto DCA | S'investir Simulateurs";
const DESCRIPTION =
  "Simulez ce qu'un investissement programmé (DCA) ou un achat unique en bitcoin, ethereum ou une autre crypto aurait rapporté, à partir des prix de marché réels. Outil gratuit et interactif, aux couleurs de la suite S'investir.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sinvestir.canot.dev"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "S'investir Simulateurs",
  keywords: [
    "simulateur crypto gratuit",
    "simulation DCA bitcoin",
    "calculateur investissement programmé",
    "backtest ethereum",
    "outils investissement gratuits",
    "S'investir",
  ],
  authors: [{ name: "S'investir" }],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "S'investir Simulateurs",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={lexend.variable}>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
