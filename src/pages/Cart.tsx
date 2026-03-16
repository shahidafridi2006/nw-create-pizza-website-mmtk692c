import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartItem from '../components/CartItem'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export default function Cart() {
  const { items, total, itemCount, clearCart } = useCart()

  const deliveryFee = total >= 25 ? 0 : 4.99
  const tax = total * 0.08
  const grandTotal = total + deliveryFee + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-stone-300 mb-6" />
            <h1 className="font-display text-3xl font-bold text-stone-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-stone-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any pizzas yet. Browse our delicious menu and find your favorites!
            </p>
            <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
              Browse Menu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mb-8">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={`${item.pizzaId}-${item.size}`} item={item} />
            ))}
            
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-stone-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({itemCount} items)</span>
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
                {total < 25 && (
                  <p className="text-sm text-secondary-600 bg-secondary-50 p-2 rounded">
                    Add ${(25 - total).toFixed(2)} more for free delivery!
                  </p>
                )}
                <div className="border-t border-stone-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-stone-800">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/menu"
                className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}