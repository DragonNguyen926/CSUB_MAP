import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type UserRole = "student" | "admin"

export type AuthUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
}

type AuthContextType = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isHydrating: boolean
  setAuthSession: (token: string, user: AuthUser) => Promise<void>
  logout: () => Promise<void>
}

const AUTH_TOKEN_KEY = "auth_token"
const AUTH_USER_KEY = "auth_user"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isHydrating, setIsHydrating] = useState(true)

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY)
        const savedUser = await AsyncStorage.getItem(AUTH_USER_KEY)

        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        } else {
          await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY])
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error("Auth hydrate error:", error)
        setToken(null)
        setUser(null)
      } finally {
        setIsHydrating(false)
      }
    }

    hydrateAuth()
  }, [])

  const setAuthSession = async (nextToken: string, nextUser: AuthUser) => {
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, nextToken],
      [AUTH_USER_KEY, JSON.stringify(nextUser)],
    ])

    setToken(nextToken)
    setUser(nextUser)
  }

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY])
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token && !!user,
      isHydrating,
      setAuthSession,
      logout,
    }),
    [token, user, isHydrating]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}