import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { dispatch, getItemCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const itemCount = getItemCount();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Menu', href: '/menu' },
    { name: 'Loyalty', href: '/loyalty' },
    { name: 'Contact', href: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full glass-effect z-50 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl font-display font-bold text-charcoal-950 tracking-tight">
              MATCHA<span className="bg-gradient-to-r from-matcha-600 to-matcha-500 bg-clip-text text-transparent">I</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-5 py-2.5 text-sm font-semibold transition-all duration-200 rounded-lg ${
                  isActive(item.href)
                    ? 'text-matcha-700 bg-matcha-50'
                    : 'text-charcoal-700 hover:text-matcha-700 hover:bg-cream-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {user && (
              <Link
                to="/loyalty"
                className="hidden md:flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-cream-100 transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-matcha-500 to-matcha-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-charcoal-800 group-hover:text-matcha-700 transition-colors">{user.full_name?.split(' ')[0]}</span>
              </Link>
            )}

            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative p-2.5 text-charcoal-700 hover:text-matcha-700 hover:bg-cream-100 rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-matcha-600 to-matcha-700 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-matcha-600/30">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2.5 text-charcoal-700 hover:bg-cream-100 rounded-lg transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-cream-200 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-3 text-base font-semibold transition-all rounded-lg ${
                    isActive(item.href)
                      ? 'text-matcha-700 bg-matcha-50'
                      : 'text-charcoal-700 hover:bg-cream-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  to="/loyalty"
                  className="flex items-center space-x-3 px-4 py-3 mt-4 border-t border-cream-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-matcha-500 to-matcha-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal-900">{user.full_name}</div>
                    <div className="text-xs text-charcoal-600">View your rewards</div>
                  </div>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}