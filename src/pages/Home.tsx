import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import PizzaCard from '../components/PizzaCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Pizza, Clock, MapPin, Phone, Star } from 'lucide-react'

interface PizzaType {
  id: number
  name: string
  description: string
  price_small: number
  price_medium: number
  price_large: number
  image_url: string
  category: string
  ingredients: string[]
  is_vegetarian: boolean
  is_spicy: boolean
  is_popular: boolean
}

const fetchPopularPizzas = async (): Promise<PizzaType[]> => {
  const { data, error } = await supabase
    .from('pizzas')
    .select('*')
    .eq('is_popular', true)
    .limit(4)
  
  if (error) throw error
  return data || []
}

export default function Home() {
  const { data: popularPizzas, isLoading, error } = useQuery({
    queryKey: ['popularPizzas'],
    queryFn: fetchPopularPizzas,
  })

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Hot pizza at your door in 30 minutes or less',
    },
    {
      icon: <Pizza className="w-8 h-8" />,
      title: 'Fresh Ingredients',
      description: 'Made with the finest imported Italian ingredients',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: '5-Star Quality',
      description: 'Award-winning recipes loved by thousands',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Local Pickup',
      description: 'Order online and skip the wait',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white/30"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-4 border-white/20"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full border-4 border-white/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Authentic Italian
                <span className="block text-secondary-300">Pizza</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-lg">
                Handcrafted with love using traditional recipes passed down through generations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/menu" className="btn-secondary text-lg">
                  Order Now
                </Link>
                <Link to="/about" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg">
                  Our Story
                </Link>
              </div>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-2xl animate-spin-slow">
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-secondary-300 to-secondary-500 flex items-center justify-center">
                      <Pizza className="w-32 h-32 text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white text-primary-600 px-4 py-2 rounded-full font-bold shadow-lg">
                  🔥 Hot & Fresh
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-stone-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Pizzas Section */}
      <section className="py-16 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Most Popular</h2>
            <p className="section-subtitle">
              Our customers' favorites, crafted with passion and premium ingredients
            </p>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              Unable to load pizzas. Please try again later.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularPizzas?.map((pizza) => (
                <PizzaCard key={pizza.id} pizza={pizza} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/menu" className="btn-primary text-lg">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Tuesday Special!
              </h3>
              <p className="text-xl text-white/90">
                Buy any large pizza and get a medium pizza FREE!
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">50% OFF</div>
              <p className="text-white/80">Every Tuesday</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-stone-50">
              <MapPin className="w-10 h-10 mx-auto mb-4 text-primary-600" />
              <h4 className="font-semibold text-lg mb-2">Location</h4>
              <p className="text-stone-600">
                123 Pizza Street<br />
                Little Italy, NY 10013
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-stone-50">
              <Phone className="w-10 h-10 mx-auto mb-4 text-primary-600" />
              <h4 className="font-semibold text-lg mb-2">Phone</h4>
              <p className="text-stone-600">
                (555) 123-4567<br />
                Open 11am - 11pm
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-stone-50">
              <Clock className="w-10 h-10 mx-auto mb-4 text-primary-600" />
              <h4 className="font-semibold text-lg mb-2">Hours</h4>
              <p className="text-stone-600">
                Mon-Thu: 11am - 10pm<br />
                Fri-Sun: 11am - 11pm
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}