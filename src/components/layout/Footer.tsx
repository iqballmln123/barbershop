import Link from "next/link"
import { Phone, MapPin, Clock, Instagram, Facebook, Twitter } from "lucide-react"
import { Button } from "../ui/button"

export function Footer() {
  return (
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
  )
} 