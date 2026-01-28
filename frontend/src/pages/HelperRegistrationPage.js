// Helper Registration Page
//
// Core Functionality:
// - Provides registration form for users to become Cub Scout helpers/volunteers
// - Collects essential contact information and optional skills/qualifications
// - Submits helper profile data to API endpoint
// - Redirects to helper dashboard upon successful registration
//
// Form Management:
// - Implements controlled form inputs with state management
// - Validates required fields (contact number, address, city, postcode)
// - Provides optional fields for skills and additional notes
// - Handles form submission with loading indicator
//
// State Management:
// - Fetches and displays current user data from authentication system
// - Manages loading states during API requests
// - Handles error states with user-friendly messages
// - Tracks form submission success with appropriate feedback
//
// User Experience:
// - Displays personalized welcome message with user's name
// - Provides important disclosure notice about working with children
// - Implements staggered animations for content reveal
// - Offers navigation options (submit or cancel)
// - Shows success message with automatic redirect
//
// Uses Tailwind CSS with nature-themed color scheme (forest-green, background-beige).
// Client-side rendered with "use client" directive.
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import { getCurrentUser } from "../utils/auth"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const HelperRegistrationPage = () => {
  const [formData, setFormData] = useState({
    contactNumber: "",
    streetAddress: "",
    city: "",
    postcode: "",
    skills: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const { user } = await getCurrentUser()
        setUserData(user)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/helpers/register", formData)
      setSuccess(true)

      setTimeout(() => {
        navigate("/helper")
      }, 2000)
    } catch (error) {
      console.error("Error registering as helper:", error)
      const errorMessage = error.response?.data?.message || "Failed to register as helper. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }
  useScrollAnimation(loading)
  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-light border-t-transparent mb-4"></div>
          <p className="text-lg font-sans text-forest-green font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-background-beige my-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <div className="bg-background-light rounded-lg shadow-md p-6 mb-8 border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Complete Your Helper Profile</h1>

        {userData && (
          <div className="mb-6 p-4 bg-primary-light rounded-md animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "150ms" }}>
            <p className="text-lg font-sans text-text-primary">
              Hello,{" "}
              <span className="font-semibold">
                {userData.firstName} {userData.lastName}
              </span>
              ! Please complete your helper profile below.
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 bg-error border-l-4 border-error text-white rounded animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <p className="font-sans">{error}</p>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-primary-light border-l-4 border-forest-green text-text-primary rounded-md animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "250ms" }}>
            <h2 className="text-xl font-heading font-bold text-forest-green mb-2">Registration Successful!</h2>
            <p className="font-sans">Your helper profile has been created. Redirecting to helper dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "300ms" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                />
              </div>

              <div>
                <label htmlFor="streetAddress" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                />
              </div>

              <div>
                <label htmlFor="postcode" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Postcode *
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-sans font-medium text-text-primary mb-1">
                Skills (optional)
              </label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="List any relevant skills or qualifications"
                rows="3"
                className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-sans font-medium text-text-primary mb-1">
                Additional Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information you'd like to share"
                rows="3"
                className="w-full px-4 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
              />
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "350ms" }}>
              <p className="font-sans font-medium">
                <strong>Important:</strong> By registering as a helper, you acknowledge that you will need to complete a
                disclosure check before working directly with children. Our leader team will contact you with more
                information about this process.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "400ms" }}>
              <button
                type="submit"
                className="px-6 py-3 bg-forest-green text-white font-sans font-medium rounded-md hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="px-6 py-3 bg-background-beige border border-border-light text-text-primary font-sans font-medium rounded-md hover:bg-primary-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default HelperRegistrationPage