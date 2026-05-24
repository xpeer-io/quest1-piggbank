import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TransactionProvider } from "@/lib/TransactionContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "piggbank",
  description: "Dashboard financeiro para PMEs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={cn("dark", geist.variable)}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Public+Sans:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{
            __html: `
            tailwind.config = {
                darkMode: "class",
                theme: {
                    extend: {
                        "colors": {
                            "secondary": "#5e5e5e",
                            "surface-container": "#eeeeee",
                            "secondary-fixed": "#e4e2e2",
                            "background": "#f9f9f9",
                            "inverse-primary": "#c6c6c6",
                            "on-secondary-fixed": "#1b1c1c",
                            "surface-bright": "#f9f9f9",
                            "outline-variant": "#cfc4c5",
                            "on-secondary-container": "#646464",
                            "on-primary-container": "#848484",
                            "outline": "#7e7576",
                            "on-primary": "#ffffff",
                            "tertiary-fixed-dim": "#c6c6c6",
                            "surface-variant": "#e2e2e2",
                            "on-primary-fixed-variant": "#474747",
                            "inverse-surface": "#303030",
                            "tertiary-fixed": "#e2e2e2",
                            "tertiary-container": "#1b1b1b",
                            "primary-fixed-dim": "#c6c6c6",
                            "on-tertiary-fixed-variant": "#474747",
                            "primary-container": "#1b1b1b",
                            "surface": "#f9f9f9",
                            "on-error": "#ffffff",
                            "on-background": "#1b1b1b",
                            "surface-container-high": "#e8e8e8",
                            "on-secondary-fixed-variant": "#474747",
                            "on-tertiary-container": "#848484",
                            "tertiary": "#000000",
                            "surface-dim": "#dadada",
                            "primary": "#000000",
                            "surface-container-low": "#f3f3f3",
                            "error": "#ba1a1a",
                            "on-secondary": "#ffffff",
                            "error-container": "#ffdad6",
                            "secondary-container": "#e4e2e2",
                            "on-tertiary-fixed": "#1b1b1b",
                            "surface-container-lowest": "#ffffff",
                            "on-tertiary": "#ffffff",
                            "on-surface-variant": "#4c4546",
                            "surface-tint": "#5e5e5e",
                            "primary-fixed": "#e2e2e2",
                            "inverse-on-surface": "#f1f1f1",
                            "surface-container-highest": "#e2e2e2",
                            "secondary-fixed-dim": "#c8c6c6",
                            "on-error-container": "#93000a",
                            "on-surface": "#1b1b1b",
                            "on-primary-fixed": "#1b1b1b"
                        },
                        "borderRadius": {
                            "DEFAULT": "0.125rem",
                            "lg": "0.25rem",
                            "xl": "0.5rem",
                            "full": "0.75rem"
                        },
                        "spacing": {
                            "section-margin": "40px",
                            "container-padding": "24px",
                            "card-gap": "20px",
                            "unit": "4px",
                            "gutter": "16px"
                        },
                        "fontFamily": {
                            "metric-lg": ["Inter"],
                            "label-caps": ["Public Sans"],
                            "display-table": ["Inter"],
                            "body-main": ["Inter"]
                        },
                        "fontSize": {
                            "metric-lg": ["36px", {"lineHeight": "40px", "letterSpacing": "-0.04em", "fontWeight": "700"}],
                            "label-caps": ["11px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "700"}],
                            "display-table": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                            "body-main": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
                        }
                    },
                },
            }
          `,
        }}
        />
      </head>
      <body className="bg-black text-white font-body-main antialiased min-h-screen">
        <TransactionProvider>{children}</TransactionProvider>
      </body>
    </html>

  );
}
