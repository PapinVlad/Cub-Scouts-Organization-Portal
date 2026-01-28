// Helper Dashboard Page
//
// Core Functionality:
// - Serves as a personalized dashboard for Cub Scout helpers/volunteers
// - Displays events the user has volunteered for with confirmation status
// - Handles helper registration workflow for new volunteers
// - Fetches helper-specific data from multiple API endpoints
//
// State Management:
// - Tracks helper registration status to show appropriate interface
// - Manages loading states during API requests
// - Handles error states with user-friendly messages
// - Stores and displays user profile information
//
// Data Integration:
// - Retrieves current user data from authentication system
// - Fetches helper profile information if available
// - Gets volunteered events specific to the helper
// - Formats dates for user-friendly display
//
// User Experience:
// - Provides clear registration pathway for new helpers
// - Shows event confirmation status with visual indicators
// - Implements staggered animations for content reveal
// - Offers direct navigation to events page
// - Includes scroll-to-top functionality for better navigation
//
// Uses Tailwind CSS with nature-themed color scheme (forest-green, background-beige).
// Client-side rendered with "use client" directive.
"use client"

import { useState, useEffect, use } from "react"
import { Link } from "react-router-dom"
import api from "../utils/api"
import { getCurrentUser } from "../utils/auth"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import ScrollToTopButton from "../components/ScrollToTopButton";

const HelperPage = () => {
  const [helperEvents, setHelperEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [needsRegistration, setNeedsRegistration] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchHelperEvents = async () => {
      try {
        setLoading(true)

        const { user } = await getCurrentUser()
        setUserData(user)

        try {
          const helperResponse = await api.get(`/helpers/user/${user.id}`, {
            signal: controller.signal,
          })

          if (!helperResponse.data || !helperResponse.data.helper) {
            console.log("Helper profile not found. User needs to register as a helper.")
            setNeedsRegistration(true)
            setLoading(false)
            return
          }

          const helperId = helperResponse.data.helper.id

          const eventsResponse = await api.get(`/events/helpers/${helperId}`, {
            signal: controller.signal,
          })

          setHelperEvents(eventsResponse.data.events || [])
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setNeedsRegistration(true)
          } else if (error.name !== "CanceledError") {
            console.error("Error fetching helper data:", error)
            setError("Failed to load helper data. Please try again later.")
          }
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching helper events:", error)
          setError("Failed to load helper events. Please try again later.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchHelperEvents()

    return () => {
      controller.abort()
    }
  }, [])
  useScrollAnimation(loading)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-light border-t-transparent mb-4"></div>
          <p className="text-lg font-sans text-forest-green font-medium">Loading helper dashboard...</p>
        </div>
      </div>
    )
  }

  if (needsRegistration) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-background-light rounded-lg shadow-md my-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-6">Complete Your Helper Profile</h1>
        {userData && (
          <p className="text-lg mb-6 font-sans text-text-primary">
            Hello, {userData.firstName} {userData.lastName}! You need to complete your helper profile before you can
            volunteer for events.
          </p>
        )}
        <div className="mt-8">
          <Link
            to="/helper/register"
            className="inline-block px-6 py-3 bg-forest-green text-white font-sans font-medium rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Complete Helper Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section>
     
    <div className="max-w-5xl mx-auto p-6 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <div className="bg-background-light rounded-lg shadow-md p-6 mb-8 border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
        <h1 className="text-3xl font-heading font-bold text-forest-green mb-4">Helper Dashboard</h1>
        {userData && (
          <div className="mb-6 p-4 bg-primary-light rounded-md animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "150ms" }}>
            <p className="text-lg font-sans text-text-primary">
              Welcome,{" "}
              <span className="font-semibold">
                {userData.firstName} {userData.lastName}
              </span>
              !
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 bg-error border-l-4 border-error text-white rounded animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <p className="font-sans">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-background-light rounded-lg shadow-md p-6 mb-8 border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "250ms" }}>
        <h2 className="text-2xl font-heading font-bold text-forest-green mb-4">Your Volunteered Events</h2>
        {helperEvents.length === 0 ? (
          <div className="p-6 bg-background-beige rounded-md text-center animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "300ms" }}>
            <p className="text-text-secondary font-sans">
              You haven't volunteered for any events yet. Check the events page to find opportunities.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border-light">
            {helperEvents.map((event, index) => (
              <li key={event.id} className="py-4 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: `${350 + index * 50}ms` }}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <div className="text-xl font-sans font-medium text-forest-green">{event.title}</div>
                    <div className="text-sm text-text-secondary mt-1 font-sans">
                      {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "Europe/London",
                      })} - {new Date(event.endDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "Europe/London",
                      })}
                    </div>
                    <div className="text-sm text-text-secondary mt-1 font-sans">{event.locationName}</div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-sans font-medium ${
                        event.confirmed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {event.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center mt-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "400ms" }}>
        <Link
          to="/events"
          className="px-6 py-3 bg-forest-green text-white font-sans font-medium rounded-md hover:bg-primary-dark transition-colors duration-200"
        >
          View All Events
        </Link>
      </div>
      
    </div>
     <ScrollToTopButton />
    </section>
  )
}

export default HelperPage