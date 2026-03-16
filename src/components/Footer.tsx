import { Link } from 'react-router-dom'
import { Pizza, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Track Order', path: '/track' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Accessibility', path: '/accessibility' },
  ]

  return (
    <footer className="bg-stone-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Pizza className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                Pizza <span className="text-secondary-400">Bella</span>
              </span>
            </Link>
            <p className="text-stone-400 text-sm mb-4">
              Authentic Italian pizza made with love since 1985. Three generations of tradition in every slice.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-stone-400 text-sm">
                  123 Pizza Street<br />
                  Little Italy, NY 10013
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-stone-400 hover:text-white transition-colors text-sm">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:info@pizzabella.com" className="text-stone-400 hover:text-white transition-colors text-sm">
                  info@pizzabella.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <div className="text-stone-400 text-sm">
                  <p>Mon - Thu: 11am - 10pm</p>
                  <p>Fri - Sun: 11am - 11pm</p>
                </div>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-stone-700 rounded-lg">
              <p className="text-secondary-400 font-medium text-sm">🎉 Tuesday Special!</p>
              <p className="text-stone-400 text-xs">Buy any large pizza, get a medium FREE!</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-400 text-sm">
              © {currentYear} Pizza Bella. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-stone-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}