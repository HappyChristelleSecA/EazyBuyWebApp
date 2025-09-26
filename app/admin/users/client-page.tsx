"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserFormModal } from "@/components/admin/user-form-modal"
import { Search, Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  status: "active" | "inactive"
  joinDate: Date
  totalOrders: number
  totalSpent: number
  password: string
}

export default function AdminUsersPageClient() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [userList, setUserList] = useState<User[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "admin")) {
      console.log("[v0] Admin users access denied:", { isAuthenticated, user: user?.role })
      router.push("/")
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      const loadUsers = () => {
        try {
          const storedUsers = localStorage.getItem("allUsers")
          console.log("[v0] Loading users from localStorage:", storedUsers)

          let allUsers: User[] = []

          // Default users that should always be available
          const defaultUsers: User[] = [
            {
              id: "1",
              name: "Admin User",
              email: "admin@eazybuy.com",
              role: "admin",
              joinDate: new Date("2024-01-01"),
              totalOrders: 0,
              totalSpent: 0,
              status: "active",
              password: "password123",
            },
            {
              id: "2",
              name: "John Doe",
              email: "user@example.com",
              role: "user",
              joinDate: new Date("2024-01-15"),
              totalOrders: 3,
              totalSpent: 354.74,
              status: "active",
              password: "password123",
            },
            {
              id: "3",
              name: "Jane Smith",
              email: "jane@example.com",
              role: "user",
              joinDate: new Date("2024-02-01"),
              totalOrders: 5,
              totalSpent: 789.5,
              status: "active",
              password: "password123",
            },
            {
              id: "4",
              name: "Mike Johnson",
              email: "mike@example.com",
              role: "user",
              joinDate: new Date("2024-02-15"),
              totalOrders: 2,
              totalSpent: 199.99,
              status: "active",
              password: "password123",
            },
            {
              id: "5",
              name: "Sarah Wilson",
              email: "sarah@example.com",
              role: "user",
              joinDate: new Date("2024-03-01"),
              totalOrders: 7,
              totalSpent: 1250.3,
              status: "active",
              password: "password123",
            },
            {
              id: "6",
              name: "David Brown",
              email: "david@example.com",
              role: "user",
              joinDate: new Date("2024-03-15"),
              totalOrders: 1,
              totalSpent: 89.99,
              status: "inactive",
              password: "password123",
            },
          ]

          if (storedUsers) {
            try {
              const parsedUsers = JSON.parse(storedUsers)
              console.log("[v0] Parsed users count:", parsedUsers.length)
              console.log("[v0] Parsed users:", parsedUsers)

              // Merge stored users with default users, avoiding duplicates
              allUsers = [...defaultUsers]

              if (Array.isArray(parsedUsers)) {
                parsedUsers.forEach((storedUser: any) => {
                  if (storedUser.email && storedUser.name && storedUser.role) {
                    const existingIndex = allUsers.findIndex((u) => u.email === storedUser.email)

                    const formattedUser: User = {
                      id: storedUser.id || `user-${Date.now()}-${Math.random()}`,
                      name: storedUser.name,
                      email: storedUser.email,
                      role: storedUser.role || "user",
                      joinDate: new Date(storedUser.createdAt || storedUser.joinDate || "2024-01-01"),
                      totalOrders: storedUser.totalOrders || 0,
                      totalSpent: storedUser.totalSpent || 0,
                      status: storedUser.status || "active",
                      password: storedUser.password || "password123",
                    }

                    if (existingIndex >= 0) {
                      // Update existing user
                      allUsers[existingIndex] = formattedUser
                    } else {
                      // Add new user
                      allUsers.push(formattedUser)
                    }
                  }
                })
              }
            } catch (parseError) {
              console.error("[v0] Error parsing stored users:", parseError)
              allUsers = defaultUsers
            }
          } else {
            allUsers = defaultUsers
          }

          // Save the merged users back to localStorage
          const usersForStorage = allUsers.map((u) => ({
            ...u,
            createdAt: u.joinDate.toISOString(),
          }))
          localStorage.setItem("allUsers", JSON.stringify(usersForStorage))

          console.log("[v0] Final user list count:", allUsers.length)
          console.log(
            "[v0] Final user list:",
            allUsers.map((u) => ({ name: u.name, email: u.email, role: u.role })),
          )
          setUserList(allUsers)
        } catch (error) {
          console.error("[v0] Error loading users:", error)
          // Fallback to default users
          const fallbackUsers: User[] = [
            {
              id: "1",
              name: "Admin User",
              email: "admin@eazybuy.com",
              role: "admin",
              joinDate: new Date("2024-01-01"),
              totalOrders: 0,
              totalSpent: 0,
              status: "active",
              password: "password123",
            },
            {
              id: "2",
              name: "John Doe",
              email: "user@example.com",
              role: "user",
              joinDate: new Date("2024-01-15"),
              totalOrders: 3,
              totalSpent: 354.74,
              status: "active",
              password: "password123",
            },
          ]
          setUserList(fallbackUsers)
          localStorage.setItem(
            "allUsers",
            JSON.stringify(fallbackUsers.map((u) => ({ ...u, createdAt: u.joinDate.toISOString() }))),
          )
        }
      }
      loadUsers()
    }
  }, [isClient])

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null
  }

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "user",
      status: userData.status || "active",
      joinDate: new Date(),
      totalOrders: 0,
      totalSpent: 0,
      password: "password123",
    }
    const updatedUsers = [...userList, newUser]
    setUserList(updatedUsers)

    const usersForStorage = updatedUsers.map((u) => ({
      ...u,
      createdAt: u.joinDate.toISOString(),
    }))
    localStorage.setItem("allUsers", JSON.stringify(usersForStorage))
    console.log("[v0] Added user and saved to localStorage:", newUser)
  }

  const handleEditUser = (userId: string, userData: Partial<User>) => {
    const updatedUsers = userList.map((u) => (u.id === userId ? { ...u, ...userData } : u))
    setUserList(updatedUsers)

    const usersForStorage = updatedUsers.map((u) => ({
      ...u,
      createdAt: u.joinDate.toISOString(),
    }))
    localStorage.setItem("allUsers", JSON.stringify(usersForStorage))
    console.log("[v0] Edited user and saved to localStorage:", userId)
  }

  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = userList.map((u) =>
      u.id === userId ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u,
    )
    setUserList(updatedUsers)

    const usersForStorage = updatedUsers.map((u) => ({
      ...u,
      createdAt: u.joinDate.toISOString(),
    }))
    localStorage.setItem("allUsers", JSON.stringify(usersForStorage))
    console.log("[v0] Toggled user status and saved to localStorage:", userId)
  }

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = userList.filter((u) => u.id !== userId)
    setUserList(updatedUsers)

    const usersForStorage = updatedUsers.map((u) => ({
      ...u,
      createdAt: u.joinDate.toISOString(),
    }))
    localStorage.setItem("allUsers", JSON.stringify(usersForStorage))
    console.log("[v0] Deleted user and saved to localStorage:", userId)
  }

  return (
    <AdminLayout title="User Management" description="Manage customer accounts and permissions">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <UserFormModal onSave={handleAddUser} />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Users ({filteredUsers.length})
              {userList.length !== filteredUsers.length && (
                <span className="text-sm text-muted-foreground ml-2">({userList.length} total)</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {userList.length === 0
                    ? "No users found. Try refreshing the page."
                    : "No users match your current filters."}
                </p>
                {userList.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setRoleFilter("all")
                    }}
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{u.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">Joined {u.joinDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{u.totalOrders} orders</p>
                        <p className="text-sm text-muted-foreground">${u.totalSpent.toFixed(2)} spent</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                        <Badge variant={u.status === "active" ? "default" : "secondary"}>{u.status}</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <UserFormModal
                          user={u}
                          onSave={(data) => handleEditUser(u.id, data)}
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {u.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(u.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
