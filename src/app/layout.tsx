import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "MyBookins – Your Favorite Services, Simplified",
  description:
    "Book experts, reserve resources, and manage appointments in one click. A complete system built for absolute precision and zero friction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
