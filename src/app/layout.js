import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jorge Carlos Quevedo — jorgeCQ",
  description:
    "Construyo sistemas que funcionan. Ideas y procesos desordenados → productos claros y utilizables. Jorge Carlos Quevedo — jorgeCQ.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${inter.className} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
