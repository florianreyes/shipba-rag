import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "../(preview)/globals.css";

export const metadata: Metadata = {
  title: "Auth - Mesh Community",
  description: "Sign in to your account",
};

export default function AuthLayout({
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 