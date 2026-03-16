import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useCart } from '../hooks/useCart'
import { toast } from 'react-hot-toast'
import { CreditCard, Truck, MapPin, User, Mail, Phone, MessageSquare } from 'lucide-react'

interface OrderItem {
  pizza_id: number
  pizza_name: string
  size: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_instructions: string | null
  total_amount: number
  status: string
  estimated_delivery: string
}

async function createOrder(orderData: OrderData, items: OrderItem[]) {
  // Calculate estimated delivery time (30-45 minutes from now)
  const estimatedDelivery = new Date()
  estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 35)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      estimated_delivery: estimatedDelivery.toISOString(),
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Insert order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    ...item,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  return order
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    instructions: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const deliveryFee = total >= 25 ? 0 : 4.99
  const tax = total * 0.08
  const grandTotal = total + deliveryFee + tax

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const mutation = useMutation({
    mutationFn: (data: { order: OrderData; items: OrderItem[] }) =>
      createOrder(data.order, data.items),
    onSuccess: (order) => {
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/track/${order.id}`)
    },
    onError: (error) => {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)

    const orderItems: OrderItem[] = items.map((item) => ({
      pizza_id: item.pizzaId,
      pizza_name: item.name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const orderData: OrderData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      delivery_address: formData.address,
      delivery_instructions: formData.instructions || null,
      total_amount: grandTotal,
      status: 'pending',
      estimated_delivery: new Date().toISOString(),
    }

    mutation.mutate({ order: orderData, items: orderItems })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-display text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  Contact Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                          errors.name ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                          errors.email ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                          errors.phone ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-display text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary-600" />
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none ${
                          errors.address ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="123 Main Street, Apt 4B&#10;New York, NY 10001"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                      <textarea
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        placeholder="Ring doorbell, leave at door, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-display text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Payment Method
                </h2>

                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-stone-600 text-sm">
                    Payment will be collected upon delivery. We accept cash, credit cards, and mobile payments.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-stone-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={`${item.pizzaId}-${item.size}`} className="flex justify-between text-sm">
                      <span className="text-stone-600">
                        {item.quantity}x {item.name} ({item.size})
                      </span>
                      <span className="text-stone-800 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-4 space-y-3">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-stone-800">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>

                <p className="text-xs text-stone-500 text-center mt-4">
                  By placing this order, you agree to our terms of service.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}