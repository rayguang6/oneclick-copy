'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
// import CreditUpdater from '../CreditUpdater'
import { ROUTES, NAV_LINKS } from '../../constants/routes'

const Navbar = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      scrolled 
        ? 'border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm' 
        : 'border-transparent bg-white'
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 group">
          <Image 
            src="/images/logo.png" 
            alt="One Click Copy" 
            width={100} 
            height={64}
            priority
          />
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-lg font-medium transition-colors relative py-5 px-1 ${
                pathname === link.href
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Right side - CreditUpdater */}
        <div className="hidden md:block">
          {/* <CreditUpdater /> */}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden px-2 pb-3 space-y-1 sm:px-3 transition-all duration-300 ${
          mobileMenuOpen ? 'block max-h-96 opacity-100' : 'hidden max-h-0 opacity-0'
        }`}
      >
        {NAV_LINKS.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
              pathname === link.href
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <div className="px-3 py-2 border-t border-gray-100 mt-2 pt-2">
          {/* <CreditUpdater /> */}
        </div>
      </div>
    </header>
  )
}

export default Navbar