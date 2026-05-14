import { useEffect, useRef, useState } from 'react'
import type { AuthUser } from '../../../features/auth/types/auth.types'

type QuickAction = {
  symbol: string
  label: string
  isEdit?: boolean
}

type SuperAdminHeaderProps = {
  user: AuthUser | null
  onLogout?: () => void
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}

const quickActions: QuickAction[] = [
  { symbol: '+', label: 'NC' },
  { symbol: '+', label: 'POS' },
  { symbol: '+', label: 'ME' },
  { symbol: '...', label: '...', isEdit: true },
]

export function SuperAdminHeader({ user, onLogout, collapsed, setCollapsed }: SuperAdminHeaderProps) {
  const displayName = user?.nombres
    ? `${user.nombres} ${user.apellidos ?? ''}`.trim()
    : 'Usuario'
  const displayEmail = user?.correo ?? 'correo@empresa.com'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="header-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Colapsar menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={collapsed ? 'M9 6l6 6-6 6' : 'M15 18l-6-6 6-6'}
            />
          </svg>
        </button>

        <div className="quick-actions">
          {quickActions.map((action) => (
            <button key={action.label} type="button" className="quick-action">
              {action.isEdit ? (
                <>
                  <span className="quick-action-icon">...</span>
                  <span className="quick-action-text">...</span>
                </>
              ) : (
                <>
                  <span className="quick-action-icon">{action.symbol}</span>
                  <span className="quick-action-text">{action.label}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="header-right" ref={menuRef}>
        <button type="button" className="header-icon">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="18" cy="19" r="1" />
          </svg>
          <span className="icon-badge badge-blue">0</span>
        </button>

        <button type="button" className="header-icon">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a3 3 0 006 0" />
          </svg>
          <span className="icon-badge badge-red">7</span>
        </button>

        <div
          className="user-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setMenuOpen((prev) => !prev)
            }
          }}
        >
          <div className="user-text">
            <p className="user-name">{displayName}</p>
            <p className="user-email">{displayEmail}</p>
          </div>
          <div className="user-avatar">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="8" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20a8 8 0 0116 0" />
            </svg>
          </div>
        </div>

        {menuOpen && (
          <div className="header-dropdown">
            <button type="button" className="dropdown-item" onClick={onLogout}>
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
