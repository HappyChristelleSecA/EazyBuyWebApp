"use client"

import { useState, useEffect } from "react"
import {
  type AuthState,
  getCurrentUser,
  setCurrentUser,
  authenticateUser,
  registerUser,
  refreshAuthState,
} from "@/lib/auth"

let globalAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

let globalInitialized = false
const stateListeners = new Set<(state: AuthState) => void>()

const updateGlobalAuthState = (newState: AuthState) => {
  globalAuthState = newState
  stateListeners.forEach((listener) => listener(newState))
}

const initializeGlobalAuth = () => {
  if (globalInitialized) return

  if (typeof window === "undefined") {
    updateGlobalAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    globalInitialized = true
    return
  }

  const user = refreshAuthState()
  console.log("[v0] Global auth initialized with user:", user)

  updateGlobalAuthState({
    user,
    isAuthenticated: !!user,
    isLoading: false,
  })

  globalInitialized = true
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(globalAuthState)

  useEffect(() => {
    const updateLocalState = (newState: AuthState) => {
      setAuthState(newState)
    }

    stateListeners.add(updateLocalState)

    if (typeof window !== "undefined" && !globalInitialized) {
      initializeGlobalAuth()
    } else {
      setAuthState(globalAuthState)
    }

    return () => {
      stateListeners.delete(updateLocalState)
    }
  }, [])

  const login = async (email: string, password: string) => {
    updateGlobalAuthState({ ...globalAuthState, isLoading: true })

    try {
      console.log("[v0] Authenticating user:", email)
      const user = await authenticateUser(email, password)
      console.log("[v0] Authentication result:", user)

      if (user) {
        setCurrentUser(user)
        updateGlobalAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        console.log("[v0] Auth state updated after login:", { user, isAuthenticated: true })
        return { success: true, user }
      } else {
        updateGlobalAuthState({ ...globalAuthState, isLoading: false })
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      console.log("[v0] Login error:", error)
      updateGlobalAuthState({ ...globalAuthState, isLoading: false })
      return { success: false, error: "Login failed" }
    }
  }

  const register = async (email: string, password: string, name: string) => {
    updateGlobalAuthState({ ...globalAuthState, isLoading: true })

    try {
      const user = await registerUser(email, password, name)
      if (user) {
        updateGlobalAuthState({ ...globalAuthState, isLoading: false })
        return { success: true }
      }
    } catch (error) {
      updateGlobalAuthState({ ...globalAuthState, isLoading: false })
      return { success: false, error: error instanceof Error ? error.message : "Registration failed" }
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user")
    setCurrentUser(null)
    updateGlobalAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    console.log("[v0] User logged out, auth state cleared")
  }

  const updateProfile = (updatedData: Partial<{ name: string; email: string; phone: string; bio: string }>) => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData }
      setCurrentUser(updatedUser)
      updateGlobalAuthState({
        ...globalAuthState,
        user: updatedUser,
      })
      console.log("[v0] Profile updated:", updatedUser)
      return { success: true }
    }
    return { success: false, error: "No user logged in" }
  }

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  }
}
