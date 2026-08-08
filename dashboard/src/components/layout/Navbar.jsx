import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiActivity, FiMenu, FiX } from 'react-icons/fi'
import { useBackendConnection } from '../../hooks/useBackendConnection.js'
import ConnectionStatus from '../ui/ConnectionStatus.jsx'
import Button from '../ui/Button.jsx'

export default function Navbar({ links }) {
  const { status } = useBackendConnection()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-bg/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-forest text-brand-primary">
            <FiActivity className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-brand-text">
            EchoFactory
          </span>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-surface text-brand-text'
                    : 'text-brand-muted hover:text-brand-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <ConnectionStatus status={status} />
          </div>
          <Button variant="accent" className="hidden sm:inline-flex">
            Analyze Now
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-text md:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-brand-border bg-brand-bg px-4 py-3 md:hidden">
          <div className="mb-3">
            <ConnectionStatus status={status} />
          </div>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-brand-surface text-brand-text'
                      : 'text-brand-muted hover:bg-brand-surface hover:text-brand-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}