"use client"
import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="text-lg font-bold">BlockShield Hub</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Solutions
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </div>
    </header>
  )
}

