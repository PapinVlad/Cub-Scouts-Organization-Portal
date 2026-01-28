"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"
import { getCurrentUser } from "../../utils/auth"

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        setLoading(true)
        const { user } = await getCurrentUser()

        const notificationResponse = await api.get("/notifications/unread/count", {
          params: { userId: user.id },
        })
        setUnreadCount(notificationResponse.data.count)

        const messageResponse = await api.get("/messages/unread/count", {
          params: { userId: user.id },
        })
        setUnreadMessages(messageResponse.data.count)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching unread counts:", error)
        setLoading(false)
      }
    }

    fetchUnreadCounts()

    const interval = setInterval(fetchUnreadCounts, 60000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return null
  }

  const totalUnread = unreadCount + unreadMessages

  if (totalUnread === 0) {
    return null
  }

  return (
    <div className="flex space-x-2">
      {unreadCount > 0 && (
        <Link
          to="/notifications"
          className="relative inline-flex items-center p-2 text-gray-700 hover:text-blue-600 transition-colors"
          aria-label={`${unreadCount} unread notifications`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        </Link>
      )}

      {unreadMessages > 0 && (
        <Link
          to="/messages/inbox"
          className="relative inline-flex items-center p-2 text-gray-700 hover:text-blue-600 transition-colors"
          aria-label={`${unreadMessages} unread messages`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadMessages}
          </span>
        </Link>
      )}
    </div>
  )
}

export default NotificationBadge
