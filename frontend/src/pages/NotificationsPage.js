// Notifications Page
//
// Core Functionality:
// - Displays user notifications with filtering capabilities
// - Fetches notification data from API based on authenticated user
// - Provides interface to mark individual or all notifications as read
// - Implements notification type filtering (all, unread, badge, event, message, helper)
//
// State Management:
// - Tracks notification data with read/unread status
// - Manages loading states during API operations
// - Handles error states with user-friendly messages
// - Maintains filter selection for notification categories
//
// User Experience:
// - Sorts notifications by date with newest first
// - Visually distinguishes unread notifications with left border
// - Displays type-specific icons for different notification categories
// - Shows timestamps in user-friendly format
// - Provides empty state messaging when no notifications exist
//
// Data Operations:
// - Fetches notifications for current authenticated user
// - Updates read status through dedicated API endpoints
// - Optimistically updates UI when marking notifications as read
// - Filters and sorts notifications client-side for responsive interaction
//
// Uses Tailwind CSS with nature-themed color scheme (forest-green, background-beige).
// Client-side rendered with "use client" directive.
"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import { getCurrentUser } from "../utils/auth"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { user } = await getCurrentUser()
        const response = await api.get("/notifications", {
          params: { userId: user.id },
        })
        setNotifications(response.data.notifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setError("Failed to load notifications. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (notificationId) => {
    try {
      const { user } = await getCurrentUser()
      await api.put(`/notifications/${notificationId}/read`, { userId: user.id })
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      setError("Failed to mark notification as read. Please try again.")
    }
  }

  const markAllAsRead = async () => {
    try {
      const { user } = await getCurrentUser()
      await api.put("/notifications/read/all", { userId: user.id })
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      )
    } catch (error) {
      console.error("Error marking all as read:", error)
      setError("Failed to mark all notifications as read. Please try again.")
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.isRead
    return notification.type === filter
  })

  const sortedNotifications = [...filteredNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  useScrollAnimation(loading)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
        </div>
        <span className="ml-4 text-lg font-sans text-forest-green font-medium">Loading notifications...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="bg-error border-l-4 border-error text-white p-4 rounded-lg" role="alert">
          <p className="font-bold font-sans">Error</p>
          <p className="font-sans">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-8 bg-background-beige rounded-xl shadow-md border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <h1 className="text-3xl font-heading font-bold text-forest-green mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
        Notifications
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "150ms" }}>
        <div className="w-full sm:w-auto">
          <label htmlFor="filter" className="block text-sm font-sans font-medium text-text-primary mb-1">
            Filter:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full sm:w-auto rounded-md border border-border-light shadow-sm focus:border-forest-green focus:ring-forest-green bg-background-light text-text-primary"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="badge">Badges</option>
            <option value="event">Events</option>
            <option value="message">Messages</option>
            <option value="helper">Helper Requests</option>
          </select>
        </div>

        <button
          className={`px-4 py-2 rounded-md text-white font-sans font-medium transition-colors ${
            !notifications.some((n) => !n.isRead)
              ? "bg-background-light text-text-secondary cursor-not-allowed"
              : "bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-offset-2"
          }`}
          onClick={markAllAsRead}
          disabled={!notifications.some((n) => !n.isRead)}
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
        {sortedNotifications.length === 0 ? (
          <div className="bg-background-light shadow rounded-lg p-6 text-center text-text-secondary">
            <p className="text-base font-sans">No notifications</p>
          </div>
        ) : (
          sortedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-background-light shadow rounded-lg overflow-hidden transition-all hover:shadow-md ${
                !notification.isRead ? "border-l-4 border-forest-green" : ""
              }`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="p-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-light text-forest-green">
                  {notification.type === "badge" && (
                    <span className="text-xl" role="img" aria-label="badge">
                      🏆
                    </span>
                  )}
                  {notification.type === "event" && (
                    <span className="text-xl" role="img" aria-label="event">
                      📅
                    </span>
                  )}
                  {notification.type === "message" && (
                    <span className="text-xl" role="img" aria-label="message">
                      ✉️
                    </span>
                  )}
                  {notification.type === "helper" && (
                    <span className="text-xl" role="img" aria-label="helper">
                      🤝
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-heading font-semibold text-text-primary">{notification.title}</h3>
                    <span className="text-sm font-sans text-text-secondary">
                      {new Date(notification.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Europe/London",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-text-primary font-sans">{notification.message}</p>
                </div>

                {!notification.isRead && (
                  <div className="flex-shrink-0">
                    <span className="inline-block w-3 h-3 rounded-full bg-forest-green"></span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    
  )
}

export default NotificationsPage