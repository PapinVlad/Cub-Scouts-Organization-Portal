"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import { getCurrentUser } from "../../utils/auth"

const NotificationList = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const { user } = await getCurrentUser()
        const response = await api.get("/notifications", {
          params: { userId: user.id },
        })
        setNotifications(response.data.notifications || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setError("Failed to load notifications. Please try again later.")
        setLoading(false)
      }
    }

    fetchNotifications()

    const interval = setInterval(fetchNotifications, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { user } = await getCurrentUser()
      await api.put(`/notifications/${notificationId}/read`, { userId: user.id })
      setNotifications(
        notifications.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      setError("Failed to mark notification as read. Please try again.")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const { user } = await getCurrentUser()
      await api.put("/notifications/read/all", { userId: user.id })
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString(),
        })),
      )
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      setError("Failed to mark all notifications as read. Please try again.")
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      const { user } = await getCurrentUser()
      await api.delete(`/notifications/${notificationId}`, { data: { userId: user.id } })
      setNotifications(notifications.filter((notification) => notification.notification_id !== notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
      setError("Failed to delete notification. Please try again.")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London",
    })
  }

  const getNotificationLink = (notification) => {
    switch (notification.notification_type) {
      case "message":
        return `/messages/${notification.reference_id}`
      case "announcement":
        return `/announcements/${notification.reference_id}`
      case "event":
        return `/events/${notification.reference_id}`
      case "badge":
        return `/badges/${notification.reference_id}`
      case "group_conversation":
        return `/group-conversations/${notification.reference_id}`
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-error border-l-4 border-error text-white rounded-lg animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <p className="font-bold font-sans">Error</p>
        <p className="font-sans">{error}</p>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center bg-background-light rounded-lg shadow animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <p className="text-text-secondary font-sans">No notifications available.</p>
      </div>
    )
  }

  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  return (
    <div className="bg-background-beige rounded-lg shadow overflow-hidden animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <div className="flex justify-between items-center p-4 border-b border-border-light">
        <h2 className="text-xl font-heading font-semibold text-forest-green">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-3 py-1 bg-forest-green text-white text-sm font-sans font-medium rounded hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-offset-2"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <div className="divide-y divide-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
        {notifications
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((notification) => {
            const link = getNotificationLink(notification)

            const NotificationContent = () => (
              <div className="w-full">
                <div className="font-medium text-text-primary font-sans">{notification.title}</div>
                <div className="mt-1 text-sm text-text-primary font-sans">{notification.content}</div>
                <div className="mt-2 text-xs text-text-secondary font-sans">{formatDate(notification.created_at)}</div>
              </div>
            )

            return (
              <div
                key={notification.notification_id}
                className={`p-4 hover:bg-background-light transition-colors ${!notification.is_read ? "bg-primary-light" : ""}`}
              >
                <div className="flex items-start">
                  {link ? (
                    <Link
                      to={link}
                      className="flex-1 flex items-start"
                      onClick={() => {
                        if (!notification.is_read) {
                          handleMarkAsRead(notification.notification_id)
                        }
                      }}
                    >
                      <NotificationContent />
                    </Link>
                  ) : (
                    <div className="flex-1">
                      <NotificationContent />
                    </div>
                  )}

                  <div className="ml-4 flex flex-col space-y-2">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.notification_id)}
                        className="px-2 py-1 text-xs bg-primary-light text-forest-green rounded hover:bg-forest-green hover:text-white transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.notification_id)}
                      className="px-2 py-1 text-xs bg-primary-dark text-white rounded hover:bg-forest-green transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default NotificationList