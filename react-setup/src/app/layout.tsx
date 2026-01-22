import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "The Accidental CTO",
  description: "From a 3 AM server crash to scaling for millions. A story about building, breaking, and learning.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "The Accidental CTO",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-serif antialiased">{children}</body>
    </html>
  );
}
