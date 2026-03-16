import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Clock, CheckCircle, Truck, Home, ChefHat, Package } from 'lucide-react'

interface Order {
  id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  delivery_instructions: string | null
  total_amount: number
  status: string
  estimated_delivery: string
  created_at: string
}

interface OrderItem {
  id: number
  order_id: number
  pizza_id: number
  pizza_name: string
  size: string
  quantity: number
  unit_price: number
  total_price: number
}

const fetchOrder = async (orderId: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', parseInt(orderId))
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

const fetchOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', parseInt(orderId))
  
  if (error) throw error
  return data || []
}

const statusSteps = [
  { id: 'pending', label: 'Order Received', icon: Package },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'baking', label: 'Baking', icon: ChefHat },
  { id: 'ready', label: 'Ready for Delivery', icon: CheckCircle },
  { id: 'delivering', label: 'On the Way', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Home },
]

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>()
  const [searchId, setSearchId] = useState('')

  const { data: order, isLoading: orderLoading, error: orderError, refetch: refetchOrder } = useQuery({
    queryKey: ['order', orderId || searchId],
    queryFn: () => fetchOrder(orderId || searchId),
    enabled: !!(orderId || searchId),
  })

  const { data: items } = useQuery({
    queryKey: ['orderItems', orderId || searchId],
    queryFn: () => fetchOrderItems(orderId || searchId),
    enabled: !!(orderId || searchId),
  })

  useEffect(() => {
    if (orderId || searchId) {
      const interval = setInterval(() => {
        refetchOrder()
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [orderId, searchId, refetchOrder])

  const currentStepIndex = statusSteps.findIndex((step) => step.id === order?.status)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      refetchOrder()
    }
  }

  const getStatusColor = (index: number) => {
    if (!order) return 'bg-stone-200'
    if (index < currentStepIndex) return 'bg-green-500'
    if (index === currentStepIndex) return 'bg-primary-600'
    return 'bg-stone-200'
  }

  const getEstimatedTime = () => {
    if (!order) return ''
    const estimated = new Date(order.estimated_delivery)
    return estimated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-8 text-center">
              Track Your Order
            </h1>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg p-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Enter your order number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g., 123"
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <button type="submit" className="btn-primary">
                  Track
                </button>
              </div>
            </form>

            {orderError && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
                Order not found. Please check your order number.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {orderLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-stone-600">Loading order details...</p>
          </div>
        ) : orderError ? (
          <div className="text-center py-16">
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-4">
              Order Not Found
            </h1>
            <p className="text-stone-600 mb-8">
              We couldn't find your order. Please check the order number and try again.
            </p>
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        ) : order ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                Order #{order.id}
              </h1>
              <p className="text-stone-600">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Status Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="font-display text-xl font-bold text-stone-800 mb-6">
                Order Status
              </h2>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-stone-200">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{
                      width: `${((currentStepIndex) / (statusSteps.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex

                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                            isActive
                              ? isCurrent
                                ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                                : 'bg-green-500 text-white'
                              : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span
                          className={`mt-2 text-xs md:text-sm text-center max-w-[80px] ${
                            isActive ? 'text-stone-800 font-medium' : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {order.status !== 'delivered' && (
                <div className="mt-8 flex items-center justify-center gap-2 text-primary-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    Estimated delivery: {getEstimatedTime()}
                  </span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-display text-xl font-bold text-stone-800 mb-4">
                  Order Details
                </h2>

                <div className="space-y-4">
                  {items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-stone-800">{item.pizza_name}</p>
                        <p className="text-sm text-stone-500">
                          {item.size.charAt(0).toUpperCase() + item.size.slice(1)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-stone-800">
                        ${item.total_price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-stone-200">
                  <div className="flex justify-between text-lg font-bold text-stone-800">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-display text-xl font-bold text-stone-800 mb-4">
                  Delivery Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-stone-500">Name</p>
                    <p className="font-medium text-stone-800">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Phone</p>
                    <p className="font-medium text-stone-800">{order.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Email</p>
                    <p className="font-medium text-stone-800">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Delivery Address</p>
                    <p className="font-medium text-stone-800 whitespace-pre-line">
                      {order.delivery_address}
                    </p>
                  </div>
                  {order.delivery_instructions && (
                    <div>
                      <p className="text-sm text-stone-500">Instructions</p>
                      <p className="font-medium text-stone-800">{order.delivery_instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 text-center">
              <Link to="/" className="btn-primary">
                Order Again
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}