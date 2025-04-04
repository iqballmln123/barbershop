import { Button } from "../ui/button"

export function HeroSection() {
  return (
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
  )
} 