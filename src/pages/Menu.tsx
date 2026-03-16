import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import PizzaCard from '../components/PizzaCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, Filter } from 'lucide-react'

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

const fetchPizzas = async (): Promise<PizzaType[]> => {
  const { data, error } = await supabase
    .from('pizzas')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })
  
  if (error) throw error
  return data || []
}

const categories = [
  { id: 'all', name: 'All Pizzas' },
  { id: 'classic', name: 'Classic' },
  { id: 'specialty', name: 'Specialty' },
  { id: 'gourmet', name: 'Gourmet' },
  { id: 'vegetarian', name: 'Vegetarian' },
]

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showVegetarian, setShowVegetarian] = useState(false)
  const [showSpicy, setShowSpicy] = useState(false)

  const { data: pizzas, isLoading, error } = useQuery({
    queryKey: ['pizzas'],
    queryFn: fetchPizzas,
  })

  const filteredPizzas = pizzas?.filter((pizza) => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pizza.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pizza.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'vegetarian' ? pizza.is_vegetarian : pizza.category === selectedCategory)
    
    const matchesVegetarian = !showVegetarian || pizza.is_vegetarian
    const matchesSpicy = !showSpicy || pizza.is_spicy

    return matchesSearch && matchesCategory && matchesVegetarian && matchesSpicy
  })

  const groupedPizzas = filteredPizzas?.reduce((acc, pizza) => {
    const category = pizza.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(pizza)
    return acc
  }, {} as Record<string, PizzaType[]>)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our Menu
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore our delicious selection of handcrafted pizzas made with the finest ingredients
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search pizzas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Toggle Filters */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVegetarian}
                  onChange={(e) => setShowVegetarian(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-stone-600">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSpicy}
                  onChange={(e) => setShowSpicy(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-stone-600">Spicy</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Pizza Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center text-red-500 py-12">
              Unable to load menu. Please try again later.
            </div>
          ) : filteredPizzas && filteredPizzas.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 mx-auto text-stone-300 mb-4" />
              <h3 className="text-xl font-semibold text-stone-600 mb-2">No pizzas found</h3>
              <p className="text-stone-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedPizzas || {}).map(([category, categoryPizzas]) => (
                <div key={category}>
                  <h2 className="font-display text-2xl font-bold text-stone-800 mb-6 capitalize">
                    {category} Pizzas
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPizzas.map((pizza) => (
                      <PizzaCard key={pizza.id} pizza={pizza} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dietary Info */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-50 rounded-2xl p-8">
            <h3 className="font-display text-2xl font-bold text-stone-800 mb-4">
              Dietary Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-stone-600">
              <div>
                <h4 className="font-semibold text-stone-800 mb-2">Vegetarian Options</h4>
                <p className="text-sm">
                  Look for the 🌱 icon for our vegetarian-friendly pizzas. We use fresh vegetables and plant-based cheese alternatives upon request.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-800 mb-2">Spicy Options</h4>
                <p className="text-sm">
                  Look for the 🌶️ icon for pizzas with a kick. Spice levels can be adjusted upon request - just let us know your preference!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}