// Newsletter Subscription Page
//
// Core Functionality:
// - Provides interface for subscribing to and unsubscribing from the Cub Scout newsletter
// - Checks existing subscription status via API
// - Handles subscription preferences for different content types
// - Integrates with user authentication to pre-fill user data
//
// State Management:
// - Tracks subscription status (checking, subscribed, not subscribed)
// - Manages form data for name, email, and content preferences
// - Handles loading states during API operations
// - Manages error states with user-friendly messages
//
// User Experience:
// - Displays different interfaces based on subscription status
// - Pre-fills form with authenticated user data when available
// - Provides clear feedback during subscription/unsubscription process
// - Implements granular content preference selection
// - Features loading indicators for asynchronous operations
//
// Data Flow:
// - Fetches user data from authentication system when available
// - Checks subscription status from API on component mount
// -
"use client"

import { useState, useEffect } from "react"
import { isAuthenticated, getCurrentUser } from "../utils/auth"
import api from "../utils/api"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const NewsletterPage = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [subscribed, setSubscribed] = useState(null) 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preferences, setPreferences] = useState({
    events: true,
    badges: true,
    general: true,
  })

  const isAuth = isAuthenticated()

  useEffect(() => {
    const fetchUserDataAndCheckSubscription = async () => {
      let userEmail = ""
      let userName = ""

      if (isAuth) {
        try {
          const { user } = await getCurrentUser()
          userEmail = user.email || ""
          userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || ""
          setEmail(userEmail)
          setName(userName)
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }

      try {
        const response = await api.get("/newsletters/check-subscription", {
          params: { email: userEmail || email },
        })
        setSubscribed(response.data.isSubscribed)
      } catch (error) {
        console.error("Error checking subscription:", error)
        setError(error.response?.data?.message || "Failed to check subscription status. Please try again later.")
      }
    }

    fetchUserDataAndCheckSubscription()
  }, [isAuth, email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!email || !name) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    const subscriptionData = {
      email,
      firstName: name.split(" ")[0] || "",
      lastName: name.split(" ").slice(1).join(" ") || "",
      preferences,
    }

    try {
      const response = await api.post("/newsletters/subscribe", subscriptionData)
      setSubscribed(true)
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setError(error.response?.data?.message || "Failed to subscribe. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/newsletters/unsubscribe", { email })
      setSubscribed(false)
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error)
      setError(error.response?.data?.message || "Failed to unsubscribe. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  useScrollAnimation(loading)

  if (subscribed === null) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
        </div>
        <span className="ml-4 text-lg font-sans text-forest-green font-medium">Checking subscription status...</span>
      </div>
    )
  }

  if (subscribed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Newsletter Subscription</h1>
        <div className="bg-background-light rounded-lg shadow-md p-6 border border-border-light">
          <div className="flex items-center mb-4 bg-primary-light p-4 rounded-md border-l-4 border-forest-green">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-forest-green mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-text-primary font-sans font-medium">
              You are already subscribed to the Obanshire Cub Scouts newsletter.
            </p>
          </div>

          <p className="text-text-secondary font-sans mb-6">If you wish, you can unsubscribe below.</p>

          {error && (
            <div className="bg-error p-4 rounded-md border-l-4 border-error mb-6">
              <p className="text-white font-sans">{error}</p>
            </div>
          )}

          <button
            className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-forest-green focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUnsubscribe}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Unsubscribing...
              </span>
            ) : (
              "Unsubscribe"
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <h1 className="text-3xl font-heading font-bold text-forest-green mb-2">Subscribe to Our Newsletter</h1>
      <p className="text-text-secondary font-sans mb-6">
        Stay updated with the latest news, events, and activities from Obanshire Cub Scouts.
      </p>

      {error && (
        <div className="bg-error p-4 rounded-md border-l-4 border-error mb-6">
          <p className="text-white font-sans">{error}</p>
        </div>
      )}

      <div className="bg-background-light rounded-lg shadow-md p-6 border border-border-light">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-sans font-medium text-text-primary mb-1">
              Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-background-beige"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-sans font-medium text-text-primary mb-1">
              Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-background-beige"
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-heading font-medium text-forest-green mb-2">Newsletter Preferences</h3>
            <p className="text-text-secondary font-sans mb-3 text-sm">Select the types of updates you'd like to receive:</p>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="events"
                    name="events"
                    checked={preferences.events}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-forest-green border-border-light rounded focus:ring-forest-green"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="events" className="font-sans font-medium text-text-primary">
                    Events and Activities
                  </label>
                  <p className="text-text-secondary font-sans">Updates about upcoming events, camps, and activities</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="badges"
                    name="badges"
                    checked={preferences.badges}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-forest-green border-border-light rounded focus:ring-forest-green"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="badges" className="font-sans font-medium text-text-primary">
                    Badge Updates
                  </label>
                  <p className="text-text-secondary font-sans">Information about new badges and achievement opportunities</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="general"
                    name="general"
                    checked={preferences.general}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-forest-green border-border-light rounded focus:ring-forest-green"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="general" className="font-sans font-medium text-text-primary">
                    General News
                  </label>
                  <p className="text-text-secondary font-sans">General updates and news about our Cub Scout pack</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-forest-green text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-border-light">
          <p className="text-xs text-text-secondary font-sans">
            By subscribing, you agree to receive emails from Obanshire Cub Scouts. You can unsubscribe at any time by
            clicking the unsubscribe link in our emails.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NewsletterPage