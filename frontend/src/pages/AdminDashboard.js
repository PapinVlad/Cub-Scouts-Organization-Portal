// Admin Dashboard Component
//
// Core Functionality:
// - Authentication & authorization checks for admin/leader access
// - Fetches and displays organization statistics via API
// - Presents user data (total users, leaders, helpers, public users, admins)
// - Shows badge statistics (total, categories, distribution)
// - Provides quick action buttons for common administrative tasks
//
// State Management:
// - Handles loading states with spinner animation
// - Manages error states with user-friendly messages
// - Stores and displays dashboard statistics
//
// Features:
// - Responsive grid layouts for different screen sizes
// - Scroll animations for progressive content reveal
// - Navigation to other admin sections
// - ScrollToTopButton for convenience
//
// Uses Tailwind CSS with custom color scheme (forest-green, background-beige).
// Client-side rendered with "use client" directive.
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { isAuthenticated, getUserRole } from "../utils/auth"
import api from "../utils/api"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import ScrollToTopButton from "../components/ScrollToTopButton"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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

    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/dashboard")
        setStats(response.data.stats)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setError("Failed to load dashboard stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [navigate])
  useScrollAnimation(loading)

  if (loading) {
    return (
      <div className="min-h-screen bg-background-beige py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-forest-green mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
            Admin Dashboard
          </h1>
          <div className="flex items-center justify-center p-12 bg-background-light rounded-lg shadow border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
            </div>
            <span className="ml-4 text-lg font-sans text-forest-green font-medium">Loading dashboard stats...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-beige py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-forest-green mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
            Admin Dashboard
          </h1>
          <div className="bg-error border-l-4 border-error p-4 rounded-md animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-white font-sans">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section>
      
    <div className="min-h-screen bg-background-beige py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background-light overflow-hidden shadow rounded-lg border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-heading font-semibold text-forest-green mb-4">User Statistics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-primary-light p-4 rounded-lg">
                  <span className="block text-sm font-sans font-medium text-text-primary">Total Users</span>
                  <span className="block text-2xl font-heading font-bold text-white ">{stats.users.total}</span>
                </div>
                <div className="bg-accent-light p-4 rounded-lg">
                  <span className="block text-sm font-sans font-medium text-text-primary">Leaders</span>
                  <span className="block text-2xl font-heading font-bold text-white">{stats.users.leaders}</span>
                </div>
                <div className="bg-primary-light p-4 rounded-lg">
                  <span className="block text-sm font-sans font-medium text-text-primary">Helpers</span>
                  <span className="block text-2xl font-heading font-bold text-white">{stats.users.helpers}</span>
                </div>
                <div className="bg-accent-light p-4 rounded-lg">
                  <span className="block text-sm font-sans font-medium text-text-primary">Public Users</span>
                  <span className="block text-2xl font-heading font-bold text-white">{stats.users.public}</span>
                </div>
                <div className="bg-primary-light p-4 rounded-lg">
                  <span className="block text-sm font-sans font-medium text-text-primary">Admins</span>
                  <span className="block text-2xl font-heading font-bold text-white">{stats.users.admin}</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/admin/users")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-sans font-medium rounded-md shadow-sm text-white bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>

          <div className="bg-background-light overflow-hidden shadow rounded-lg border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "150ms" }}>
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-heading font-semibold text-white mb-4">Badge Statistics</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-primary-light p-4 rounded-lg">
                  <span className="block text-sm font-sans font-medium text-text-primary">Total Badges</span>
                  <span className="block text-2xl font-heading font-bold text-white">{stats.badges.total}</span>
                </div>
                <div className="bg-accent-light p-4 rounded-lg">
                  <span className="block text-sm font-sans font-medium text-text-primary">Categories</span>
                  <span className="block text-2xl font-heading font-bold text-white">{stats.badges.categories}</span>
                </div>
              </div>
              <h3 className="text-lg font-heading font-medium text-white mb-2">Badges by Category</h3>
              <ul className="divide-y divide-border-light bg-background-beige rounded-md overflow-hidden">
                {Object.entries(stats.badges.byCategory).map(([category, count]) => (
                  <li key={category} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-sans font-medium text-text-primary">{category}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-primary-light text-white">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex space-x-4 justify-around">
                <button
                  onClick={() => navigate("/admin/badges")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-sans font-medium rounded-md shadow-sm text-white bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green"
                >
                  Manage Badges
                </button>
                <button
                  onClick={() => navigate("/admin/badges/new")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-sans font-medium rounded-md shadow-sm text-white bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green"
                >
                  Create New Badge
                </button>
                
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
    <ScrollToTopButton />
      </section>
  )
}

export default AdminDashboard