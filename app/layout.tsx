import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevX - AI Assistant Prototype",
  description: "Transform complex technical concepts into simple explanations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
