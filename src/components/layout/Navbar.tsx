import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

interface NavbarProps {
  activeSection: string
  scrollToSection: (id: string) => void
}

export function Navbar({ activeSection, scrollToSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="text-neutral-900 font-bold text-2xl font-heading">
              <span className="text-amber-700">Culture</span>
              {!isMobile && <span>Barbershop</span>}
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {["home", "gallery", "barbers", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                  activeSection === item ? "text-amber-700" : "text-neutral-700"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
            <Link href="/login">
              <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">Login</Button>
            </Link>
          </nav>

          <div className="md:hidden flex items-center">
            <Link href="/login" className="mr-4">
              <Button size="sm" className="bg-neutral-900 hover:bg-neutral-800 text-white">Login</Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 