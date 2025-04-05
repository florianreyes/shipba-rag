import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { WorkspaceProvider } from "@/lib/context/workspace-context";
import { Navbar } from "@/components/navbar";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <WorkspaceProvider>
            <div className="flex flex-col min-h-[100dvh]">
              <Navbar />
              {children}
            </div>
          </WorkspaceProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
