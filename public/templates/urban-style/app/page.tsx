import Image from "next/image"
import { ArrowRight, ShoppingBag, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A]">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-1690321608227-df2b9cf50821.jpg-eMGAcQz0E3xsWyvUmgCDRd2pZW6ZzO.jpeg"
              alt="Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
          </div>

          {/* Content */}
          <div className="relative container flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6 [text-shadow:_0_4px_12px_rgb(0_0_0_/_20%)]">
              <span className="block mb-4 [text-shadow:_0_4px_12px_rgb(0_0_0_/_20%)]">Urban Style</span>
              <span className="text-blue-400 italic font-light">beyond</span>
              <span className="text-gray-300 italic font-light"> the ordinary</span>
            </h1>
            <p className="max-w-[600px] text-gray-300 text-lg md:text-xl mb-12">
              Discover premium streetwear that transforms your everyday style into extraordinary statements.
            </p>
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="relative overflow-hidden py-32">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-1690321608227-df2b9cf50821.jpg-eMGAcQz0E3xsWyvUmgCDRd2pZW6ZzO.jpeg"
              alt="Background"
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
          </div>

          <div className="container relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center text-white [text-shadow:_0_4px_12px_rgb(0_0_0_/_20%)]">
              Explore Our <span className="text-blue-400">Collections</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="group relative overflow-hidden rounded-3xl bg-black/60 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-black/70 border border-white/10"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={400}
                      height={500}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>

                    <div className="flex flex-wrap gap-2">
                      {category.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">{category.description}</p>

                    <div className="pt-4">
                      <Button className="w-full bg-blue-500 hover:bg-blue-400 text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        Explore Collection
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="relative overflow-hidden py-32">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-1690321608227-df2b9cf50821.jpg-eMGAcQz0E3xsWyvUmgCDRd2pZW6ZzO.jpeg"
              alt="Background"
              fill
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
          </div>

          <div className="container relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-center text-white [text-shadow:_0_4px_12px_rgb(0_0_0_/_20%)]">
              New <span className="text-blue-400">Arrivals</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="group bg-black/60 backdrop-blur-sm rounded-xl p-4 transition-transform duration-300 hover:scale-105 border border-white/10"
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-black/50 mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-400 font-bold">{product.price}</p>
                    <Button
                      size="icon"
                      className="bg-blue-500 hover:bg-blue-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo-1690321608227-df2b9cf50821.jpg-eMGAcQz0E3xsWyvUmgCDRd2pZW6ZzO.jpeg"
              alt="Background"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
          </div>

          <div className="container py-32">
            <div className="relative flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xl rounded-2xl" />
              <div className="relative px-6 py-12">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white [text-shadow:_0_4px_12px_rgb(0_0_0_/_20%)]">
                  Join Our <span className="text-blue-400">Community</span>
                </h2>
                <p className="text-gray-300 text-lg max-w-[600px] mb-8">
                  Subscribe to our newsletter and get 10% off your first purchase plus exclusive access to new arrivals
                  and special offers.
                </p>
                <form className="flex w-full max-w-md mx-auto gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-full px-6 py-3 bg-black/50 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                  <Button className="bg-blue-500 hover:bg-blue-400 rounded-full px-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    <Mail className="h-5 w-5 mr-2" />
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const categories = [
  {
    name: "Street Style",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Urban", "Casual", "Trending"],
    description:
      "Contemporary urban fashion that makes a statement. Featuring hoodies, graphic tees, and statement pieces for the bold and fashion-forward.",
  },
  {
    name: "Casual Wear",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Comfort", "Essential", "Daily"],
    description:
      "Effortlessly stylish everyday wear. Premium basics and versatile pieces that combine comfort with modern design.",
  },
  {
    name: "Accessories",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Style", "Premium", "Details"],
    description:
      "Complete your look with our curated selection of accessories. From minimalist jewelry to statement bags and more.",
  },
]

const products = [
  {
    name: "Urban Comfort Hoodie",
    price: "$89.99",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    name: "Street Smart Jacket",
    price: "$129.99",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    name: "City Dweller Pants",
    price: "$79.99",
    image: "/placeholder.svg?height=500&width=500",
  },
  {
    name: "Metro Chic Sneakers",
    price: "$99.99",
    image: "/placeholder.svg?height=500&width=500",
  },
]

