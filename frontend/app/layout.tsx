import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swadeshi Mart - E-commerce",
  description: "Your one-stop shop for authentic Indian products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <OrderProvider>
          <UserProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
            </CartProvider>
          </UserProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
