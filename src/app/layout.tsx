import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { InventoryProvider } from "@/context/InventoryContext";
import BottomNav from "@/components/BottomNav";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "My Bar - The Timeless Archive",
  description: "A deterministic, utility-driven cocktail recommendation engine.",
  manifest: "/manifest.json", // Ready for PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="bg-black text-foreground antialiased min-h-screen flex justify-center items-center">
        <div className="w-full max-w-md mx-auto h-[100dvh] relative shadow-2xl overflow-hidden bg-background flex flex-col border-x border-border/50">
          <InventoryProvider>
            <main className="flex-1 overflow-y-auto pb-16">
              {children}
            </main>
            <BottomNav />
            <Toaster theme="dark" toastOptions={{
              className: 'bg-stone-900 border-stone-800 text-stone-200',
              descriptionClassName: 'text-stone-400'
            }} />
          </InventoryProvider>
        </div>
      </body>
    </html>
  );
}
