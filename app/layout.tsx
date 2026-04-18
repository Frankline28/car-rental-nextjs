import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxe Drive | Premium Car Rental",
  description: "Experience the ultimate in luxury and performance with our curated fleet of premium vehicles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <AuthProvider>
          <Navbar />
          <div className="pt-20 lg:pt-24 min-h-screen transition-all duration-500">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
