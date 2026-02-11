import type { Metadata } from "next";
import { Geist, Geist_Mono, Atkinson_Hyperlegible } from "next/font/google";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ServiceWorkerPurge from "./components/ServiceWorkerPurge";

import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-atkinson",
});

export const metadata: Metadata = {
  title: "Advokit",
  description:
    "Advokit helps people navigate UK welfare benefits and services with clear, accessible guidance co-designed with people with aphasia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={atkinsonHyperlegible.className}>
        <Navbar />
        <ServiceWorkerPurge />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

// <body className={`${atkinsonHyperlegible.className} bg-advokit-page`}>
