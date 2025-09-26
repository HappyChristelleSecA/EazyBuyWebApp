export type UserRole = "admin" | "user" | "guest"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  password?: string
  emailVerified?: boolean
  verificationToken?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@eazybuy.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    password: "password123",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "John Doe",
    role: "user",
    createdAt: new Date("2024-01-15"),
    password: "password123",
  },
]

const loadRegisteredUsers = (): User[] => {
  if (typeof window === "undefined") return mockUsers

  try {
    const storedUsers = localStorage.getItem("allUsers")
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers)
      const validUsers = parsedUsers.filter((user: any) => user.email && user.password && user.name && user.role)

      // Merge with mock users, avoiding duplicates
      const allUsers = [...mockUsers]
      validUsers.forEach((user: User) => {
        if (!allUsers.find((u) => u.email === user.email)) {
          allUsers.push(user)
        }
      })
      console.log(
        "[v0] Loaded registered users:",
        allUsers.map((u) => ({ email: u.email, hasPassword: !!u.password })),
      )
      return allUsers
    }
  } catch (error) {
    console.log("[v0] Failed to load registered users:", error)
  }

  return mockUsers
}

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log("[v0] Authenticating user:", email)
  console.log("[v0] Checking credentials for:", email)

  const allUsers = loadRegisteredUsers()
  console.log(
    "[v0] Available users:",
    allUsers.map((u) => ({ email: u.email, role: u.role })),
  )

  const user = allUsers.find((u) => u.email === email)
  console.log("[v0] Found user:", user)

  // Demo users don't have emailVerified property, and new users start unverified
  if (user && user.password === password) {
    console.log("[v0] Authentication successful for:", user.email)
    // Return user without password for security
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  console.log("[v0] Authentication failed")
  return null
}

export const registerUser = async (email: string, password: string, name: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allUsers = loadRegisteredUsers()

  // Check if user already exists
  if (allUsers.find((u) => u.email === email)) {
    throw new Error("User already exists")
  }

  const verificationToken = Math.random().toString(36).substring(2, 15)

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role: "user",
    createdAt: new Date(),
    password, // Keep password for authentication
    emailVerified: false, // Start with unverified email
    verificationToken, // Store verification token
  }

  const updatedUsers = [...allUsers, newUser]

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers))
      console.log("[v0] User registered with verification token:", email)

      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "verification",
            email: email,
            userName: name,
            token: verificationToken,
          }),
        })

        const emailResult = await response.json()

        if (emailResult.success) {
          console.log(`[v0] Verification email sent successfully to: ${email}`)
        } else {
          console.log(`[v0] Failed to send verification email: ${emailResult.error}`)
        }
      } catch (emailError) {
        console.log(`[v0] Email sending error: ${emailError}`)
      }
    } catch (error) {
      console.log("[v0] Failed to store users:", error)
    }
  }

  // Return user without password for security
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export const verifyEmail = async (token: string): Promise<{ success: boolean; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allUsers = loadRegisteredUsers()
  const userIndex = allUsers.findIndex((u) => u.verificationToken === token)

  if (userIndex === -1) {
    return { success: false, error: "Invalid or expired verification token" }
  }

  // Mark user as verified
  allUsers[userIndex].emailVerified = true
  allUsers[userIndex].verificationToken = undefined

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("allUsers", JSON.stringify(allUsers))
      console.log("[v0] Email verified for user:", allUsers[userIndex].email)
    } catch (error) {
      console.log("[v0] Failed to update user verification:", error)
    }
  }

  return { success: true }
}

export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const allUsers = loadRegisteredUsers()
  const user = allUsers.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "No account found with this email address" }
  }

  const resetToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "password-reset",
        email: email,
        userName: user.name,
        token: resetToken,
      }),
    })

    const result = await response.json()

    if (result.success) {
      console.log(`[v0] Password reset email sent successfully to: ${email}`)
      console.log(`[v0] Reset token generated: ${resetToken}`)
      return { success: true }
    } else {
      console.log(`[v0] Failed to send password reset email: ${result.error}`)
      return { success: false, error: result.error || "Failed to send reset email" }
    }
  } catch (error) {
    console.log(`[v0] Password reset email error: ${error}`)
    return { success: false, error: "Failed to send reset email" }
  }
}

export const resetPasswordWithToken = async (
  token: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const allUsers = loadRegisteredUsers()

  // In a real application, you would:
  // 1. Verify the reset token is valid and not expired
  // 2. Find the user associated with the token
  // 3. Update the user's password in the database
  // 4. Invalidate the reset token

  // For demo purposes, we'll simulate successful password reset
  // In production, you'd validate the token against stored reset tokens
  console.log(`[v0] Password reset with token: ${token}`)
  console.log(`[v0] New password would be set for user with token: ${token}`)

  // Simulate token validation
  if (token.length < 10) {
    return { success: false, error: "Invalid or expired reset token" }
  }

  // In production, update the user's password here
  // const userIndex = allUsers.findIndex(u => u.resetToken === token && u.resetTokenExpiry > Date.now())
  // if (userIndex !== -1) {
  //   allUsers[userIndex].password = newPassword
  //   allUsers[userIndex].resetToken = undefined
  //   allUsers[userIndex].resetTokenExpiry = undefined
  //   localStorage.setItem("allUsers", JSON.stringify(allUsers))
  // }

  return { success: true }
}

let memoryCache: User | null = null
let isInitialized = false

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  // Always return memory cache if available and initialized
  if (isInitialized) {
    console.log("[v0] getCurrentUser from memory cache:", memoryCache)
    return memoryCache
  }

  console.log("[v0] getCurrentUser initializing from storage...")

  try {
    // Try to load from storage only once during initialization
    let userData = null

    try {
      userData = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser")
    } catch (storageError) {
      console.log("[v0] Storage access failed, using memory only:", storageError)
    }

    if (userData) {
      const user = JSON.parse(userData)
      memoryCache = user
      console.log("[v0] getCurrentUser loaded from storage:", user)
    } else {
      console.log("[v0] getCurrentUser: no data found in storage")
    }
  } catch (error) {
    console.log("[v0] Failed to parse user data:", error)
    memoryCache = null
  }

  isInitialized = true
  return memoryCache
}

export const setCurrentUser = (user: User | null): void => {
  // Always update memory cache first
  memoryCache = user
  isInitialized = true

  if (typeof window === "undefined") return

  try {
    if (user) {
      const userData = JSON.stringify(user)
      // Try to save to storage, but don't fail if it doesn't work
      try {
        sessionStorage.setItem("currentUser", userData)
        localStorage.setItem("currentUser", userData)
        console.log("[v0] setCurrentUser saved to storage and memory:", user)
      } catch (storageError) {
        console.log("[v0] Storage save failed, using memory only:", storageError)
      }
    } else {
      // Clear storage if possible
      try {
        sessionStorage.removeItem("currentUser")
        localStorage.removeItem("currentUser")
      } catch (storageError) {
        console.log("[v0] Storage clear failed:", storageError)
      }
      console.log("[v0] setCurrentUser cleared from memory")
    }
  } catch (error) {
    console.log("[v0] Error in setCurrentUser:", error)
  }
}

export const refreshAuthState = (): User | null => {
  isInitialized = false
  memoryCache = null
  return getCurrentUser()
}
