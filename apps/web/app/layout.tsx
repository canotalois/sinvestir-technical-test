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

const TITLE = "Simulateur crypto DCA — S'investir";
const DESCRIPTION =
  "Simulez ce qu'un investissement programmé (DCA) ou un achat unique en bitcoin, ethereum ou une autre crypto aurait rapporté, à partir des prix de marché réels. Aux couleurs de la suite S'investir.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "S'investir Simulateurs",
  keywords: [
    "simulateur crypto",
    "DCA",
    "bitcoin",
    "ethereum",
    "investissement",
    "backtest",
    "S'investir",
  ],
  authors: [{ name: "S'investir" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "fr_FR",
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
