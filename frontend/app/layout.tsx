import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduVerse LMS - Super Admin Dashboard",
  description: "Manage institutions, pricing, courses, announcements, and platform-wide metrics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-surface font-inter text-on-surface">{children}</body>
    </html>
  );
}


