import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/navbar"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BlockShield Hub - Advanced Blockchain Security",
  description: "Enterprise-grade security solutions for blockchain networks",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className }>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

