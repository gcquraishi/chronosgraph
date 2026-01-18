import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChronosGraph - Historical Figures Across Media",
  description: "Explore how historical figures are portrayed across fiction and history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased bg-background text-foreground"
      >
        {children}
      </body>
    </html>
  );
}
