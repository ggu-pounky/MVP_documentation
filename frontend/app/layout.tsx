import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestion des Besoins",
  description: "Application CRUD pour gérer les besoins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar />
          <main className="main-content flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
