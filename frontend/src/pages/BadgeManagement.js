// Badge Management Page
//
// Core Functionality:
// - Provides CRUD operations for badge administration
// - Displays badges in a responsive grid with images and details
// - Implements search functionality for badge name and description
// - Offers category filtering through dropdown selection
// - Fetches badge data and categories from API endpoints
//
// Security & Permissions:
// - Restricts access to authenticated admin and leader roles
// - Redirects unauthorized users to login or home page
// - Confirms badge deletion with confirmation dialog
//
// State Management:
// - Handles loading states with custom spinner animation
// - Manages error states with user-friendly messages
// - Maintains search and filter states for badge listing
// - Implements optimistic UI updates after deletion
//
// Features:
// - Responsive grid layout adapting to different screen sizes
// - Staggered scroll animations for content reveal
// - Badge cards with difficulty rating using star symbols
// - Image handling with fallback for missing images
// - Navigation to create new badges or edit existing ones
//
// Uses Tailwind CSS with nature-themed color scheme (forest-green, background-beige).
// Client-side rendered with "use client" directive.
"use client"

import { useState, useEffect, use } from "react"
import { useNavigate } from "react-router-dom"
import { isAuthenticated, getUserRole } from "../utils/auth"
import api from "../utils/api"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import ScrollToTopButton from "../components/ScrollToTopButton"

const BadgeManagement = () => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
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

    const fetchData = async () => {
      try {
        const [badgesResponse, categoriesResponse] = await Promise.all([
          api.get("/badges"),
          api.get("/badges/categories"),
        ])


        if (badgesResponse.data && badgesResponse.data.badges) {
          setBadges(badgesResponse.data.badges)
        } else {
          console.error("Unexpected badges response format:", badgesResponse.data)
          setBadges([])
          setError("Invalid badge data format")
        }

        if (categoriesResponse.data && categoriesResponse.data.categories) {
          setCategories(categoriesResponse.data.categories)
        } else {
          console.error("Unexpected categories response format:", categoriesResponse.data)
          setCategories([])
        }
      } catch (error) {
        console.error("Error fetching badges:", error)
        setBadges([]) 
        setError("Failed to load badges")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleDelete = async (badgeId) => {
    if (!window.confirm("Are you sure you want to delete this badge?")) {
      return
    }

    try {
      await api.delete(`/badges/${badgeId}`)
      setBadges(badges.filter((badge) => badge.id !== badgeId))
    } catch (error) {
      console.error("Error deleting badge:", error)
      setError("Failed to delete badge")
    }
  }
  useScrollAnimation(loading)

  const filteredBadges =
    badges && badges.length > 0
      ? badges.filter((badge) => {
          const matchesSearch =
            badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesCategory = selectedCategory === "" || badge.category === selectedCategory

          return matchesSearch && matchesCategory
        })
      : []

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Badge Management</h1>
        <div className="flex items-center justify-center p-8 bg-background-light rounded-lg shadow border border-border-light">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section>
      
    <div className="container mx-auto px-4 py-8 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Badge Management</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
        <button
          onClick={() => navigate("/admin/badges/new")}
          className="bg-forest-green hover:bg-primary-dark text-white font-sans font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Badge
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="border border-border-light hover:bg-primary-light text-text-primary font-sans font-medium py-2 px-4 rounded-md transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-error border-l-4 border-error text-white p-4 mb-6 rounded-md animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "150ms" }}>
          <p className="font-sans">{error}</p>
        </div>
      )}

      <div className="bg-background-light rounded-lg shadow-md p-6 mb-8 border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-sans font-medium text-text-primary mb-1">
              Search Badges
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
              />
            </div>
          </div>

          <div className="md:w-1/3">
            <label htmlFor="category" className="block text-sm font-sans font-medium text-text-primary mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredBadges.length === 0 ? (
        <div className="bg-background-beige border border-border-light rounded-lg p-8 text-center text-text-secondary font-sans animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "250ms" }}>
          No badges match your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge, index) => (
            <div
              key={badge.id}
              className="bg-background-light rounded-lg shadow-md overflow-hidden border border-border-light hover:shadow-lg transition-colors duration-200 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8"
              style={{ transitionDelay: `${300 + index * 50}ms` }}
            >
              <div
                className="p-4 flex items-center justify-center bg-background-beige border-b border-border-light"
                style={{ height: "160px" }}
              >
                {badge.imageUrl ? (
                  <img
                    src={`http://localhost:5000${badge.imageUrl}`}
                    alt={badge.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder-badge.png"
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-accent-light text-text-secondary text-sm font-sans">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-heading font-semibold text-forest-green mb-1">{badge.name}</h3>
                <span className="inline-block bg-primary-light text-white text-xs px-2 py-1 rounded-full mb-2 font-sans">
                  {badge.category}
                </span>
                <div className="text-yellow-500 mb-2 font-sans">Difficulty: {Array(badge.difficultyLevel).fill("★").join("")}</div>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2 font-sans">{badge.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/admin/badges/edit/${badge.id}`)}
                    className="flex-1 bg-primary-light hover:bg-forest-green text-white hover:text-white py-2 px-3 rounded-md text-sm font-sans font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(badge.id)}
                    className="flex-1 bg-primary-dark hover:bg-forest-green text-white py-2 px-3 rounded-md text-sm font-sans font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <ScrollToTopButton />
    </section>
  )
}

export default BadgeManagement