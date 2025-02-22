import { Button } from "@/components/ui/button"
import { Shield, Lock, Blocks, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container relative space-y-16">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="bg-gradient-to-r from-primary/70 to-primary bg-clip-text text-4xl font-bold tracking-tighter text-transparent md:text-6xl">
                Secure Your Blockchain Assets with Confidence
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
                Advanced protection for your digital assets. Industry-leading security protocols and real-time threat
                detection for blockchain networks.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg" className="gap-2">
                Get Started <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2 rounded-lg bg-muted/50 p-4">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-5xl space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Enterprise-Grade Security Features</h2>
            <p className="mt-4 text-muted-foreground">Comprehensive protection for your blockchain infrastructure</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-4 rounded-lg border p-6">
                <div className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container py-24">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h2 className="text-3xl font-bold">Ready to Secure Your Network?</h2>
            <p className="text-muted-foreground">
              Join thousands of organizations that trust BlockShield Hub for their blockchain security needs.
            </p>
            <div className="space-x-4">
              <Button size="lg">Start Free Trial</Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">BlockShield Hub</h3>
              <p className="text-sm text-muted-foreground">
                Securing the future of blockchain technology with advanced protection and monitoring.
              </p>
            </div>
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlockShield Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

const stats = [
  { label: "Protected Networks", value: "500+" },
  { label: "Threats Blocked", value: "1M+" },
  { label: "Client Satisfaction", value: "99.9%" },
]

const features = [
  {
    icon: Shield,
    title: "Real-time Protection",
    description: "24/7 monitoring and instant threat detection for your blockchain network.",
  },
  {
    icon: Lock,
    title: "Smart Contract Audit",
    description: "Automated and manual security audits for smart contract vulnerabilities.",
  },
  {
    icon: Blocks,
    title: "Network Analysis",
    description: "Deep analysis of network patterns to identify potential security risks.",
  },
]

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Security", href: "#" },
      { label: "Enterprise", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
]

