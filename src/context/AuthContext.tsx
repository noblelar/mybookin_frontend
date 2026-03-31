'use client'

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'

import type { ApiErrorResponse, AuthSession, SessionResponse } from '@/types/auth'

type LogoutResult = {
  success: boolean
  message?: string
}

interface AuthContextType {
  hasHydrated: boolean
  isLoading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  isAuthenticated: boolean
  session: AuthSession | null
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  refreshSession: () => Promise<void>
  clearSession: () => void
  logout: () => Promise<LogoutResult>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [hasHydrated, setHasHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<AuthSession | null>(null)

  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  useEffect(() => {
    let cancelled = false

    async function hydrateSession() {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as SessionResponse
        if (!cancelled) {
          setSession(payload.authenticated ? payload.session : null)
          setHasHydrated(true)
        }
      } catch {
        if (!cancelled) {
          setSession(null)
          setHasHydrated(true)
        }
      }
    }

    void hydrateSession()

    return () => {
      cancelled = true
    }
  }, [])

  async function refreshSession() {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        cache: 'no-store',
      })

      const payload = (await response.json()) as SessionResponse
      setSession(payload.authenticated ? payload.session : null)
    } catch {
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  function clearSession() {
    setSession(null)
    setIsLoading(false)
  }

  async function logout() {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      let payload: ApiErrorResponse | null = null
      try {
        payload = (await response.json()) as ApiErrorResponse
      } catch {
        payload = null
      }

      if (!response.ok) {
        setIsLoading(false)
        return {
          success: false,
          message: payload?.message ?? 'We could not sign you out right now.',
        }
      }

      setSession(null)
      router.replace('/login')
      router.refresh()

      return {
        success: true,
        message: payload?.message ?? 'Logged out successfully.',
      }
    } catch {
      setIsLoading(false)
      return {
        success: false,
        message: 'We could not sign you out right now.',
      }
    }
  }

  const value: AuthContextType = {
    hasHydrated,
    isLoading,
    setLoading: setIsLoading,
    isAuthenticated: Boolean(session),
    session,
    setSession,
    refreshSession,
    clearSession,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0B1C30] border-t-transparent" />
        </div>
      )}

      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
