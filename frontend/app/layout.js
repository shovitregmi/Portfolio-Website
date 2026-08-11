import { Syne, DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

const body = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shovitregmi.com.np";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shovit Regmi — Full-Stack Web Developer",
    template: "%s | Shovit Regmi",
  },
  description:
    "Full-stack web developer portfolio. Building modern web applications, backend systems, and AI-powered tools.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Shovit Regmi Portfolio",
    title: "Shovit Regmi — Full-Stack Web Developer",
    description:
      "Full-stack web developer portfolio. Building modern web applications, backend systems, and AI-powered tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shovit Regmi — Full-Stack Web Developer",
    description:
      "Full-stack web developer portfolio. Building modern web applications, backend systems, and AI-powered tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
