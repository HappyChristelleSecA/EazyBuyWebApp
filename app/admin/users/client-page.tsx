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
          if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers)
            const formattedUsers = parsedUsers.map((u: any) => ({
              ...u,
              joinDate: new Date(u.createdAt || u.joinDate || "2024-01-01"),
              totalOrders: u.totalOrders || 0,
              totalSpent: u.totalSpent || 0,
              status: u.status || "active",
            }))
            setUserList(formattedUsers)
          } else {
            // Fallback to default users
            setUserList([
              {
                id: "1",
                name: "Admin User",
                email: "admin@eazybuy.com",
                role: "admin",
                joinDate: new Date("2024-01-01"),
                totalOrders: 0,
                totalSpent: 0,
                status: "active",
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
              },
            ])
          }
        } catch (error) {
          console.error("[v0] Error loading users:", error)
          // Fallback to default users on error
          setUserList([
            {
              id: "1",
              name: "Admin User",
              email: "admin@eazybuy.com",
              role: "admin",
              joinDate: new Date("2024-01-01"),
              totalOrders: 0,
              totalSpent: 0,
              status: "active",
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
            },
          ])
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
    }
    setUserList([...userList, newUser])
  }

  const handleEditUser = (userId: string, userData: Partial<User>) => {
    setUserList(userList.map((u) => (u.id === userId ? { ...u, ...userData } : u)))
  }

  const handleToggleUserStatus = (userId: string) => {
    setUserList(
      userList.map((u) => (u.id === userId ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)),
    )
  }

  const handleDeleteUser = (userId: string) => {
    setUserList(userList.filter((u) => u.id !== userId))
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
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
