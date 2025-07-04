import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, User, LogOut, Settings } from 'lucide-react'
import { useCodeAccess } from '../../hooks/useCodeAccess'
import { Button } from '../ui/Button'
import { AccessStatus } from '../auth/AccessStatus'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { hasAccess } = useCodeAccess()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Players', href: '/players' },
    { name: 'My Team', href: '/team' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Trade Center', href: '/trades' },
    { name: 'Draft Assistant', href: '/draft' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <header className="bg-dark-900/95 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold gradient-text">Fantasy Glitch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Access Status */}
            <div className="hidden sm:block">
              <AccessStatus />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-2 rounded-lg nav-link ${
                    isActive(item.href) ? 'nav-link-active bg-dark-800' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}