import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Building } from "lucide-react"

import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Office Seating Charts",
  description: "Interactive seating charts for multiple office locations",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-200 bg-white shadow-sm">
              <div className="container flex h-16 items-center px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
                  <Building className="h-5 w-5 text-office-maroon" />
                  <span className="font-interface">Office Seating Charts</span>
                </Link>
                <nav className="ml-auto flex gap-4">
                  <Button variant="ghost" className="hover:bg-slate-100 hover:text-slate-800 h-10 px-4" asChild>
                    <Link href="/">Locations</Link>
                  </Button>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-200 bg-white py-4">
              <div className="container flex items-center justify-between px-4 text-sm text-muted-foreground">
                <p>© 2025 Office Seating Charts</p>
                <p>All rights reserved</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
