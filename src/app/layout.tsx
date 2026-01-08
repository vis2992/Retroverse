import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Retrospeck - See your sprints more clearly",
  description: "A friendly, real-time retrospective tool that helps agile teams reflect, learn, and continuously improve together. Guided by Retrospeck, your wise owl companion.",
  keywords: ["retrospective", "agile", "scrum", "team collaboration", "feedback", "sprint review", "retrospeck"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
