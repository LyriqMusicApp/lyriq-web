'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Music, Menu, X, ChevronDown, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/create', label: 'Create' },
  { href: '/library', label: 'Library' },
  { href: '/my-songs', label: 'My Songs' },
]

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    clearAuth()
    document.cookie = 'lyriq-authed=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E7EC' }} className="sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/create" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#5B47FB' }}>
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: '#101828' }}>Lyriq</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                link.href === '/create' && "font-semibold",
                pathname.startsWith(link.href)
                  ? "text-white"
                  : "hover:bg-gray-50"
              )}
              style={pathname.startsWith(link.href)
                ? { background: '#5B47FB', color: '#FFFFFF' }
                : { color: '#475467' }
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Profile dropdown */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-50"
            style={{ color: '#475467' }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: '#5B47FB' }}>
              {user?.display_name?.charAt(0)?.toUpperCase() ?? 'T'}
            </div>
            <span className="text-sm font-medium max-w-[120px] truncate" style={{ color: '#101828' }}>
              {user?.display_name ?? 'Teacher'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 rounded-xl py-1 z-20" style={{ background: '#FFFFFF', border: '1px solid #E4E7EC', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-all" style={{ color: '#101828' }}>
                  <User className="w-4 h-4" /> Profile
                </Link>
                <div style={{ borderTop: '1px solid #E4E7EC', margin: '4px 0' }} />
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-all" style={{ color: '#EF4444' }}>
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg" onClick={() => setMobileOpen(o => !o)} style={{ color: '#475467' }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 space-y-1" style={{ borderTop: '1px solid #E4E7EC' }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium"
              style={pathname.startsWith(link.href)
                ? { background: '#EEEBFF', color: '#5B47FB' }
                : { color: '#475467' }
              }
            >
              {link.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #E4E7EC', paddingTop: 8 }}>
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm" style={{ color: '#475467' }}>Profile</Link>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm" style={{ color: '#EF4444' }}>Sign out</button>
          </div>
        </div>
      )}
    </header>
  )
}
