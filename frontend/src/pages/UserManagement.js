// User Management Page
//
// Core Functionality:
// - Provides administrative interface for managing system users
// - Displays comprehensive user list with detailed information
// - Enables role management (admin, leader, helper, public)
// - Implements user deletion with confirmation
//
// Security & Permissions:
// - Restricts access to authenticated admin and leader roles
// - Redirects unauthorized users to appropriate pages
// - Implements proper authorization checks before rendering
//
// User Interface:
// - Features search functionality for finding specific users
// - Provides role filtering to view users by type
// - Displays color-coded role indicators for quick identification
// - Presents user data in sortable, responsive table format
//
// State Management:
// - Handles loading states with custom spinner animation
// - Manages error states with user-friendly messages
// - Tracks success message
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { isAuthenticated, getUserRole } from "../utils/auth"
import api from "../utils/api"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import ScrollToTopButton from "../components/ScrollToTopButton"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const navigate = useNavigate()
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login")
      return
    }

    const userRole = getUserRole()
    if (userRole !== "admin" && userRole !== "leader") {
      navigate("/")
      return
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users")
        setUsers(response.data.users)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [navigate])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put("/admin/users/role", { userId, role: newRole })

      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    } catch (error) {
      console.error("Error updating user role:", error)
      setError("Failed to update user role")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      await api.delete(`/admin/users/${userId}`)
      setUsers(users.filter((user) => user.id !== userId))
      setSuccess("User successfully deleted")
    } catch (error) {
      console.error("Error deleting user:", error)
      setError("Failed to delete user. Please try again later.")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === "" || user.role === selectedRole

    return matchesSearch && matchesRole
  })
  useScrollAnimation(loading)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">User Management</h1>
        <div className="flex items-center justify-center p-8 bg-background-light rounded-lg shadow border border-border-light">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">User Management</h1>
        <div className="bg-error border-l-4 border-error text-white p-4 mb-6 rounded-md" role="alert">
          <p className="font-sans">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <section>
      
    <div className="container mx-auto px-4 py-8 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">User Management</h1>

      {success && (
        <div className="bg-primary-light border-l-4 border-forest-green text-text-primary p-4 mb-6 rounded-md animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }} role="alert">
          <p className="font-sans">{success}</p>
        </div>
      )}

      <div className="mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "150ms" }}>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 bg-background-light hover:bg-primary-light text-text-primary rounded-md transition-colors font-sans"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-light text-text-primary"
          />
        </div>

        <div className="w-full md:w-1/2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-light text-text-primary"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="leader">Leader</option>
            <option value="helper">Helper</option>
            <option value="public">Public</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-background-light p-8 text-center rounded-md shadow animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "250ms" }}>
          <p className="text-text-secondary font-sans">No users found matching your criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-background-light rounded-lg shadow border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "300ms" }}>
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-background-beige">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-text-primary uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-text-primary uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-text-primary uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-text-primary uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-text-primary uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-text-primary uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-sans font-medium text-text-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background-light divide-y divide-border-light">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-primary-light">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-sans font-medium text-text-primary">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary font-sans">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary font-sans">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-sans font-semibold rounded-full 
                      ${user.role === "admin" ? "bg-purple-100 text-purple-800" : ""}
                      ${user.role === "leader" ? "bg-blue-100 text-blue-800" : ""}
                      ${user.role === "helper" ? "bg-green-100 text-green-800" : ""}
                      ${user.role === "public" ? "bg-gray-100 text-gray-800" : ""}
                    `}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary font-sans">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "Europe/London",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-secondary font-sans">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            timeZone: "Europe/London",
                          })
                        : "Never"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans font-medium">
                    <div className="flex items-center space-x-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-sm border border-border-light rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-light text-text-primary"
                      >
                        <option value="admin">Admin</option>
                        <option value="leader">Leader</option>
                        <option value="helper">Helper</option>
                        <option value="public">Public</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-sm bg-primary-dark hover:bg-forest-green text-white px-2 py-1 rounded-md transition-colors"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <ScrollToTopButton />
      </section>
  )
}

export default UserManagement