"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { Menu, Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area"

export default function BarberShopDashboard() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isMobile, setIsMobile] = useState(false)

  const { ref: galleryRef, inView: galleryInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const { ref: barbersRef, inView: barbersInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

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

    // Simulate image loading
    setTimeout(() => {
      setImagesLoaded(true)
    }, 2000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (galleryInView) setActiveSection("gallery")
    else if (barbersInView) setActiveSection("barbers")
    else setActiveSection("home")
  }, [galleryInView, barbersInView])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  const haircuts = [
    { id: 1, name: "Classic Cut", image: "/placeholder.svg?height=400&width=300" },
    { id: 2, name: "Fade", image: "/placeholder.svg?height=400&width=300" },
    { id: 3, name: "Pompadour", image: "/placeholder.svg?height=400&width=300" },
    { id: 4, name: "Undercut", image: "/placeholder.svg?height=400&width=300" },
    { id: 5, name: "Crew Cut", image: "/placeholder.svg?height=400&width=300" },
    { id: 6, name: "Textured Crop", image: "/placeholder.svg?height=400&width=300" },
  ]

  const barbers = [
    { id: 1, name: "James Wilson", role: "Master Barber", image: "/placeholder.svg?height=300&width=300" },
    { id: 2, name: "Michael Brown", role: "Senior Stylist", image: "/placeholder.svg?height=300&width=300" },
    { id: 3, name: "Robert Davis", role: "Beard Specialist", image: "/placeholder.svg?height=300&width=300" },
    { id: 4, name: "Thomas Moore", role: "Junior Barber", image: "/placeholder.svg?height=300&width=300" },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Navbar */}
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
              <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">Book Now</Button>
            </nav>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section id="home" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-neutral-900">
                Premium Grooming Experience
              </h1>
              <p className="text-neutral-600 text-lg mb-8">
                Elevate your style with our expert barbers and premium services tailored to your unique look.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">Book Appointment</Button>
                <Button variant="outline" className="border-neutral-300 text-neutral-700">
                  View Services
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" ref={galleryRef} className="py-16 bg-neutral-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold font-heading mb-12 text-center text-neutral-900">Our Signature Styles</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {haircuts.map((haircut) => (
                <div
                  key={haircut.id}
                  className={`overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-500 ${
                    galleryInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${haircut.id * 100}ms` }}
                >
                  {!imagesLoaded ? (
                    <div className="relative h-80 w-full">
                      <Skeleton className="h-full w-full absolute inset-0">
                        <div
                          className="h-full w-full bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse"
                          style={{ animationDuration: "2s" }}
                        />
                      </Skeleton>
                    </div>
                  ) : (
                    <div className="relative h-80 w-full">
                      <Image
                        src={haircut.image || "/placeholder.svg"}
                        alt={haircut.name}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-heading font-medium text-lg text-neutral-900">{haircut.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Barbers Section */}
        <section id="barbers" ref={barbersRef} className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold font-heading mb-12 text-center text-neutral-900">
              Meet Our Expert Barbers
            </h2>

            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-6 pb-6">
                {barbers.map((barber) => (
                  <Card
                    key={barber.id}
                    className={`min-w-[280px] transition-all duration-500 hover:shadow-md hover:scale-[1.02] ${
                      barbersInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${barber.id * 100}ms`, scrollSnapAlign: "start" }}
                  >
                    <CardContent className="p-0">
                      <div className="relative h-64 w-full">
                        <Image
                          src={barber.image || "/placeholder.svg"}
                          alt={barber.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading font-bold text-xl mb-1 text-neutral-900">{barber.name}</h3>
                        <p className="text-amber-700 font-medium mb-4">{barber.role}</p>
                        <Button variant="outline" className="w-full border-neutral-300 text-neutral-700">
                          Book Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-neutral-900 text-neutral-200 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold font-heading mb-6 text-white">Culture Barbershop</h3>
              <p className="mb-6">
                Premium barbershop providing exceptional grooming services in a sophisticated atmosphere.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-neutral-200 hover:text-amber-500">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-neutral-200 hover:text-amber-500">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-neutral-200 hover:text-amber-500">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading mb-6 text-white">Services</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="hover:text-amber-500 transition-colors">
                    Haircuts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-500 transition-colors">
                    Beard Trims
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-500 transition-colors">
                    Hot Towel Shaves
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-500 transition-colors">
                    Hair Styling
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading mb-6 text-white">Hours</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Mon-Fri: 9am - 8pm</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Saturday: 10am - 6pm</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>Sunday: 11am - 5pm</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading mb-6 text-white">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>123 Barber Street, Suite 101</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-500" />
                  <a href="tel:+1234567890" className="hover:text-amber-500 transition-colors">
                    (123) 456-7890
                  </a>
                </li>
              </ul>
              <div className="mt-6 h-[200px] w-full bg-neutral-800 rounded-lg overflow-hidden">
                {/* Google Maps would be embedded here */}
                <div className="h-full w-full flex items-center justify-center text-neutral-400">
                  Google Maps Preview (400x200px)
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-400 text-sm">
            <p>© {new Date().getFullYear()} PrimeCuts Barbershop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

