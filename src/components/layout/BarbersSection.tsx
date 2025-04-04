import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

interface BarbersSectionProps {
  barbersRef: React.RefObject<HTMLElement>
  barbersInView: boolean
}

export function BarbersSection({ barbersRef, barbersInView }: BarbersSectionProps) {
  const barbers = [
    { id: 1, name: "James Wilson", role: "Master Barber", image: "/placeholder.svg?height=300&width=300" },
    { id: 2, name: "Michael Brown", role: "Senior Stylist", image: "/placeholder.svg?height=300&width=300" },
    { id: 3, name: "Robert Davis", role: "Beard Specialist", image: "/placeholder.svg?height=300&width=300" },
    { id: 4, name: "Thomas Moore", role: "Junior Barber", image: "/placeholder.svg?height=300&width=300" },
  ]

  return (
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
  )
} 