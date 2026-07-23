import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Vaibhav Khurana — Resume Editor", description: "Local-only, printable resume editor" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
