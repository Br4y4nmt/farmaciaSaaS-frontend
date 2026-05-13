import { useEffect, useState } from 'react'
import type { AuthUser } from '../types/auth.types'
import { getStoredUser } from '../utils/authStorage'

export function useStoredUser() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  return user
}
