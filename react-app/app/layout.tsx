import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TargetComponent } from "./components/TargetComponent"; // Import the client component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elemental Gauge Simulator",
  description: "A interactive Genshin elemental reaction simulator based on gauge theory.",
};

export default function RootLayout() {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TargetComponent/>
      </body>
    </html>
  );
}