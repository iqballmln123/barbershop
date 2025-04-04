"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"

import { Navbar } from "../components/layout/Navbar"
import { HeroSection } from "../components/layout/HeroSection"
import { GallerySection } from "../components/layout/GallerySection"
import { BarbersSection } from "../components/layout/BarbersSection"
import { Footer } from "../components/layout/Footer"

export default function BarberShopDashboard() {
  const [activeSection, setActiveSection] = useState("home")

  const { ref: galleryRef, inView: galleryInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const { ref: barbersRef, inView: barbersInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

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

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />

      <main className="pt-20">
        <HeroSection />
        <GallerySection galleryRef={galleryRef} galleryInView={galleryInView} />
        <BarbersSection barbersRef={barbersRef} barbersInView={barbersInView} />
      </main>

      <Footer />
    </div>
  )
}

