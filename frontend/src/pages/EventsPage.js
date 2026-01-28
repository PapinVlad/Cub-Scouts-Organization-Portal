// Events Page
//
// Core Functionality:
// - Provides comprehensive event management for Cub Scout organization
// - Implements multiple view states (list, detail, create/edit, helpers, attendance, statistics)
// - Fetches and displays events with filtering capabilities
// - Supports CRUD operations for events with proper authorization
// - Manages event registration and volunteer tracking
//
// Role-Based Access:
// - Restricts administrative functions to leader and admin roles
// - Provides specialized interfaces for helpers to volunteer
// - Adapts UI based on user authentication status and role
// - Implements proper redirects for unauthorized access attempts
//
// State Management:
// - Handles complex view state transitions between different interfaces
// - Manages loading and error states across multiple API interactions
// - Implements filtering state for event discovery
// - Tracks selected event and registration status
//
// User Experience:
// - Features animated transitions between view states
// - Implements scroll animations for content reveal
// - Provides testimonials and call-to-action for engagement
// - Includes responsive hero section with parallax effect
// - Offers clear navigation between different sections
//
// Uses Tailwind CSS with nature-themed color scheme and custom animations.
// Client-side rendered with "use client" directive.
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { isAuthenticated, getUserRole } from "../utils/auth"
import api from "../utils/api"
import EventList from "../components/EventList"
import EventDetail from "../components/EventDetail"
import EventFilter from "../components/EventFilter"
import EventForm from "../components/EventForm"
import EventHelperManagement from "../components/EventHelperManagement"
import EventAttendance from "../components/EventAttendance"
/* import EventRegistration from "../components/EventRegistration" */
import EventStatistics from "../components/EventStatistics"
import { Link, useLocation } from "react-router-dom";
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import ScrollToTopButton from "../components/ScrollToTopButton"
import {  Phone } from "lucide-react"

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    upcoming: true,
    past: false,
    eventType: "",
    startDate: "",
    endDate: "",
  })
  const [view, setView] = useState("list") 
  const [isRegistered, setIsRegistered] = useState(false)
  const [volunteeredEvents, setVolunteeredEvents] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const pageRef = useRef(null)
  const navigate = useNavigate()

  const userRole = getUserRole()
  const isAuth = isAuthenticated()
  const isLeader = userRole === "leader" || userRole === "admin"
  const isHelper = userRole === "helper"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (view === "helpers" && !isAuth) {
      navigate("/login")
    }
  }, [view, isAuth, navigate])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-animation")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [view, events])

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }))
  }, [])

  useEffect(() => {
  const controller = new AbortController();

  const fetchEvents = async () => {
  try {
    setLoading(true);
    const userRole = getUserRole();
    const response = await api.get("/events", {
      params: { ...filters, userRole },
      signal: controller.signal,
    });
    
    setEvents(response.data.events || []);
  } catch (error) {
    if (error.name !== "CanceledError") {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};

  fetchEvents();

  return () => {
    controller.abort();
  };
}, [filters]);

  useEffect(() => {
    const controller = new AbortController()

    const fetchVolunteeredEvents = async () => {
      if (isAuth && isHelper) {
        try {
          const userResponse = await api.get("/auth/user", {
            signal: controller.signal,
          })

          if (!userResponse.data || !userResponse.data.user) {
            console.error("User data not found")
            return
          }

          const userId = userResponse.data.user.id

          try {
            const helperResponse = await api.get(`/helpers/user/${userId}`, {
              signal: controller.signal,
            })

            if (!helperResponse.data || !helperResponse.data.helper) {
              console.log("Helper profile not found for user ID:", userId)
              return
            }

            const helperId = helperResponse.data.helper.id

            const eventsResponse = await api.get(`/events/helpers/${helperId}`, {
              signal: controller.signal,
            })

            if (eventsResponse.data && Array.isArray(eventsResponse.data.events)) {
              setVolunteeredEvents(eventsResponse.data.events.map((event) => event.id))
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.log("Helper profile not found for this user. This is normal for non-helper users.")
            } else if (error.name !== "CanceledError") {
              console.error("Error fetching helper data:", error)
            }
          }
        } catch (error) {
          if (error.name !== "CanceledError") {
            console.error("Error fetching volunteered events:", error)
          }
        }
      }
    }

    fetchVolunteeredEvents()

    return () => {
      controller.abort()
    }
  }, [isAuth, isHelper])

  useEffect(() => {
    const controller = new AbortController()

    const fetchEventDetails = async () => {
      if (selectedEventId) {
        try {
          setLoading(true)
          const response = await api.get(`/events/${selectedEventId}`, {
            signal: controller.signal,
          })
          setSelectedEvent(response.data.event)
          setView("detail")

          if (isAuth) {
            try {
              const regResponse = await api.get(`/events/${selectedEventId}/register`, {
                signal: controller.signal,
              })
              setIsRegistered(regResponse.data.isRegistered)
            } catch (error) {
              if (error.name !== "CanceledError") {
                console.error("Error checking registration status:", error)
              }
            }
          }
        } catch (error) {
          if (error.name !== "CanceledError") {
            console.error("Error fetching event details:", error)
            setError("Failed to load event details. Please try again later.")
          }
        } finally {
          setLoading(false)
        }
      } else {
        setSelectedEvent(null)
      }
    }

    fetchEventDetails()

    return () => {
      controller.abort()
    }
  }, [selectedEventId, isAuth])

  const handleEventSelect = (eventId) => {
    setSelectedEventId(eventId)
  }

  const handleBackToList = () => {
    setSelectedEventId(null)
    setView("list")
  }

  const handleCreateEvent = () => {
    setSelectedEventId(null)
    setSelectedEvent(null)
    setView("create")
  }

  const handleEditEvent = (eventId) => {
    setSelectedEventId(eventId)
    setView("edit")
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      setLoading(true)
      await api.delete(`/events/${eventId}`)
      setSelectedEventId(null)
      setSelectedEvent(null)
      setView("list")

      const response = await api.get("/events", {
        params: filters,
      })
      setEvents(response.data.events || [])
    } catch (error) {
      console.error("Error deleting event:", error)
      setError("Failed to delete event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleManageHelpers = (eventId) => {
    setSelectedEventId(eventId)
    setView("helpers")
  }

  const handleManageAttendance = (eventId) => {
    setSelectedEventId(eventId)
    setView("attendance")
  }

  const handleViewStatistics = () => {
    setSelectedEventId(null)
    setSelectedEvent(null)
    setView("stats")
  }

  const handleSubmitEvent = async (formData) => {
    try {
      setLoading(true)
      if (view === "edit" && selectedEventId) {
        await api.put(`/events/${selectedEventId}`, formData)
      } else {
        await api.post("/events", formData)
      }

      const response = await api.get("/events", {
        params: filters,
      })
      setEvents(response.data.events || [])

      setSelectedEventId(null)
      setSelectedEvent(null)
      setView("list")
    } catch (error) {
      console.error("Error saving event:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleRegistrationChange = (newStatus) => {
    setIsRegistered(newStatus)
  }
  useScrollAnimation(loading);

  return (
    <div
      ref={pageRef}
      className={`min-h-screen bg-gradient-to-b from-background-beige to-white transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-woodland-brown to-secondary-light text-white">
       <div className="absolute inset-0">
          <img
            src="/assets/sun-and-baloon.gif" 
            alt="Obanshire Cub Scouts Adventure Animation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Scout Adventures & Events</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover exciting opportunities to learn, grow, and make memories that last a lifetime
            </p>

            {isLeader && (
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button
                  onClick={handleCreateEvent}
                  className="bg-white text-secondary hover:bg-background-beige px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create New Event
                </button>
                <button
                  onClick={handleViewStatistics}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  View Statistics
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wave Divider */}
       <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 100L60 80C120 60 240 20 360 20C480 20 600 60 720 80C840 100 960 100 1080 80C1200 60 1320 20 1380 0L1440 0V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z"
              fill="#F5F5DC"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-error text-error p-4 mb-6 rounded-md shadow-sm" role="alert">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {view === "list" && (
          <div className="space-y-8 scroll-animation">
            <EventFilter onFilterChange={handleFilterChange} />

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative w-20 h-20">
                  <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
                  <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <span className="ml-4 text-lg text-secondary font-medium">Loading adventures...</span>
              </div>
            ) : (
              <EventList events={events} onEventSelect={handleEventSelect} />
            )}
          </div>
        )}

        {view === "detail" && selectedEvent && (
          <div className="space-y-6 scroll-animation">
            <EventDetail
              event={selectedEvent}
              onBack={handleBackToList}
              onEdit={isLeader ? handleEditEvent : null}
              onDelete={isLeader ? handleDeleteEvent : null}
              onManageHelpers={isLeader ? handleManageHelpers : null}
              onManageAttendance={isLeader ? handleManageAttendance : null}
              isVolunteered={volunteeredEvents.includes(selectedEvent.id)}
            />
            {/* {!isLeader && !isHelper && (
              <EventRegistration
                event={selectedEvent}
                isRegistered={isRegistered}
                onRegistrationChange={handleRegistrationChange}
              />
            )} */}
          </div>
        )}

        {view === "create" && (
          <div className="scroll-animation">
            <EventForm onSubmit={handleSubmitEvent} onCancel={handleBackToList} />
          </div>
        )}

        {view === "edit" && selectedEvent && (
          <div className="scroll-animation">
            <EventForm event={selectedEvent} onSubmit={handleSubmitEvent} onCancel={handleBackToList} />
          </div>
        )}

        {view === "helpers" && selectedEventId && (
          <div className="mt-6 scroll-animation">
            <button
              onClick={handleBackToList}
              className="flex items-center text-primary hover:text-primary-dark mb-4 transition-colors duration-200 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Events
            </button>
            <EventHelperManagement eventId={selectedEventId} />
          </div>
        )}

        {view === "attendance" && selectedEventId && (
          <div className="mt-6 scroll-animation">
            <button
              onClick={handleBackToList}
              className="flex items-center text-primary hover:text-primary-dark mb-4 transition-colors duration-200 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Events
            </button>
            <EventAttendance eventId={selectedEventId} />
          </div>
        )}

        {view === "stats" && (
          <div className="mt-6 scroll-animation">
            <button
              onClick={handleBackToList}
              className="flex items-center text-primary hover:text-primary-dark mb-4 transition-colors duration-200 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Events
            </button>
            <EventStatistics />
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      {view === "list" && events.length > 0 && (
        <div className="bg-gradient-to-b from-white to-background-beige py-16 scroll-animation">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-secondary mb-12">What Scouts Say About Our Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <blockquote className="text-secondary text-center italic mb-4">
                  "The summer camp was amazing! I learned so many new skills and made friends that I'll keep for life.
                  Can't wait for next year's adventure!"
                </blockquote>
                <p className="text-primary font-semibold text-center">- Alex, 12</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <blockquote className="text-secondary text-center italic mb-4">
                  "The hiking expedition taught me about perseverance and teamwork. The views from the mountain top were
                  absolutely worth every step!"
                </blockquote>
                <p className="text-primary font-semibold text-center">- Samantha, 14</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <blockquote className="text-secondary text-center italic mb-4">
                  "I was nervous about the overnight camping trip, but the leaders made it so fun! I learned how to
                  build a fire and set up a tent all by myself."
                </blockquote>
                <p className="text-primary font-semibold text-center">- Michael, 11</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {view === "list" && (
       <section className="py-16 bg-forest-green text-white text-center animate-on-scroll  transition-all duration-700 translate-y-8">
                     <div className="container mx-auto px-4">
                       <h2 className="text-3xl font-heading font-bold mb-6">Be Part of Our Story</h2>
                       <p className="text-xl mb-8 max-w-2xl mx-auto">
                         Whether you’re a cub ready for adventure, a parent wanting to help, or a leader eager to inspire, Obanshire Cub Scouts welcomes you.
                       </p>
                       <Link
                         to="/login"
                         className="btn bg-white text-woodland-brown hover:bg-forest-green hover:text-white border-2 border-white px-6 py-3 rounded-md inline-block transition-colors duration-200"
                       >
                         Join Our Pack Today
                       </Link>
                     </div>
                   </section>
      )}

      {/* Add custom CSS for animations */}
      
      <div className="fixed bottom-8 right-8 z-20">
        <a
          href="tel:+441234567890"
          className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 transform hover:scale-110"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
      <ScrollToTopButton />
    </div>
  )
}

export default EventsPage
