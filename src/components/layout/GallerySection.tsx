import { useState, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "../ui/skeleton"

interface GallerySectionProps {
  galleryRef: React.RefObject<HTMLElement>
  galleryInView: boolean
}

export function GallerySection({ galleryRef, galleryInView }: GallerySectionProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Simulate image loading
    setTimeout(() => {
      setImagesLoaded(true)
    }, 2000)
  }, [])

  const haircuts = [
    { id: 1, name: "Classic Cut", image: "/placeholder.svg?height=400&width=300" },
    { id: 2, name: "Fade", image: "/placeholder.svg?height=400&width=300" },
    { id: 3, name: "Pompadour", image: "/placeholder.svg?height=400&width=300" },
    { id: 4, name: "Undercut", image: "/placeholder.svg?height=400&width=300" },
    { id: 5, name: "Crew Cut", image: "/placeholder.svg?height=400&width=300" },
    { id: 6, name: "Textured Crop", image: "/placeholder.svg?height=400&width=300" },
  ]

  return (
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
  )
} 