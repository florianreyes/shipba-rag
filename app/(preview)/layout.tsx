import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-rag.vercel.app"),
  title: "Mesh Community",
  description:
    "An app to network.",
  icons: {
    icon: "/mesh.ico",
    apple: "/mesh.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
