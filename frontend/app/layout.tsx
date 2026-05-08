import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoboNav — GPS Navigation System",
  description: "Real-time GPS navigation dashboard for autonomous robot fleets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
