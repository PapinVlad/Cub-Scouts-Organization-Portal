"use client"

import { useState } from "react"
import api from "../../utils/api"

const NewsletterSubscription = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email) {
      setError("Email is required")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await api.post("/newsletters/subscribe", formData)

      setSuccess(response.data.message)
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
      })

      setLoading(false)
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setError(error.response?.data?.message || "Failed to subscribe. Please try again later.")
      setLoading(false)
    }
  }

  return (
    <div className="bg-background-light rounded-lg shadow-md p-6 border border-border-light max-w-md mx-auto animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <h2 className="text-2xl font-heading font-bold text-forest-green mb-2">Subscribe to Our Newsletter</h2>
      <p className="text-text-secondary font-sans mb-6">
        Stay updated with the latest news, events, and activities from Obanshire Cub Scouts.
      </p>

      {error && (
        <div className="bg-error p-4 rounded-md border-l-4 border-error mb-6">
          <p className="text-white font-sans">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-primary-light p-4 rounded-md border-l-4 border-forest-green mb-6">
          <p className="text-text-primary font-sans">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-sans font-medium text-text-primary mb-1">
            Email Address <span className="text-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-background-beige"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-sans font-medium text-text-primary mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-background-beige"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-sans font-medium text-text-primary mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-background-beige"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-forest-green text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-forest-green focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
      </form>

      <div className="mt-6 pt-4 border-t border-border-light">
        <p className="text-xs text-text-secondary font-sans">
          By subscribing, you agree to receive emails from Obanshire Cub Scouts. You can unsubscribe at any time by
          clicking the unsubscribe link in our emails.
        </p>
      </div>
    </div>
  )
}

export default NewsletterSubscription