import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { Menu, X, ShoppingCart, Pizza } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pizza className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-stone-800">
              Pizza <span className="text-primary-600">Bella</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600'
                    : 'text-stone-600 hover:text-primary-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 text-stone-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/track"
              className="hidden md:block text-sm font-medium text-stone-600 hover:text-primary-600 transition-colors"
            >
              Track Order
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-stone-100">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary-600'
                      : 'text-stone-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/track"
                onClick={() => setIsOpen(false)}
                className="font-medium text-stone-600 hover:text-primary-600 transition-colors"
              >
                Track Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}