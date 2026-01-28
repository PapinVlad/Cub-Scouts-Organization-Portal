// Create Badge Page
//
// Core Functionality:
// - Provides interface for administrators and leaders to create new badges
// - Renders BadgeForm component with empty initial values
// - Implements authentication and authorization checks
// - Redirects unauthorized users to appropriate pages
//
// Security & Permissions:
// - Restricts access to authenticated admin and leader roles
// - Redirects unauthorized users to login or home page
// - Prevents unauthorized badge creation
//
// State Management:
// - Handles loading states with custom spinner animation
// - Manages error states with user-friendly messages
// - Initializes form with empty badge template
//
// User Experience:
// - Provides clear page title and context
// - Implements smooth loading transitions
// - Offers navigation back to badge list on error
// - Uses consistent styling with badge management pages
//
// Uses Tailwind CSS with nature-themed color scheme (forest-green, background-beige).
// Client-side rendered with "use client" directive.
"use client"

import { useNavigate } from "react-router-dom"
import { isAuthenticated, getUserRole } from "../utils/auth"
import BadgeForm from "../components/BadgeForm"
import { use, useEffect, useState } from "react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const CreateBadge = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

    setLoading(false)
  }, [navigate])
  useScrollAnimation(loading)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Create New Badge</h1>
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
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Create New Badge</h1>
        <div className="bg-error border-l-4 border-error text-white p-4 mb-6 rounded">
          <p className="font-sans">{error}</p>
        </div>
        <button
          onClick={() => navigate("/admin/badges")}
          className="border border-border-light bg-background-beige text-text-primary hover:bg-primary-light font-sans font-medium py-2 px-4 rounded-md transition-colors"
        >
          Back to Badges
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Create New Badge</h1>
      <BadgeForm
        isEditing={false}
        badge={{
          name: "",
          category: "",
          description: "",
          difficultyLevel: 1,
          requirements: [],
          activities: [],
        }}
      />
    </div>
  )
}

export default CreateBadge