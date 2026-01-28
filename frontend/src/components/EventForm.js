"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"

const EventForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationName: "",
    locationAddress: "",
    latitude: "",
    longitude: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    eventType: "Meeting",
    requiredHelpers: 0,
    notes: "",
    equipment: "",
    cost: "",
    publicVisible: true,
    leadersOnlyVisible: false,
    helpersOnlyVisible: false,
    badgeIds: [],
  })

  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await api.get("/badges")
        setBadges(response.data.badges || [])
      } catch (error) {
        console.error("Error fetching badges:", error)
        setError("Failed to load badges. Please try again later.")
      }
    }

    fetchBadges()

    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        locationName: event.locationName || "",
        locationAddress: event.locationAddress || "",
        latitude: event.latitude || "",
        longitude: event.longitude || "",
        startDate: event.startDate ? new Date(event.startDate).toISOString().split("T")[0] : "",
        endDate: event.endDate ? new Date(event.endDate).toISOString().split("T")[0] : "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        eventType: event.eventType || "Meeting",
        requiredHelpers: event.requiredHelpers || 0,
        notes: event.notes || "",
        equipment: event.equipment || "",
        cost: event.cost || "",
        publicVisible: event.publicVisible !== undefined ? event.publicVisible : true,
        leadersOnlyVisible: event.leadersOnlyVisible || false,
        helpersOnlyVisible: event.helpersOnlyVisible || false,
        badgeIds: event.badges ? event.badges.map((badge) => badge.id) : [],
      })
    }
  }, [event])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleBadgeChange = (e) => {
    const badgeId = Number.parseInt(e.target.value)
    const isChecked = e.target.checked

    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          badgeIds: [...prev.badgeIds, badgeId],
        }
      } else {
        return {
          ...prev,
          badgeIds: prev.badgeIds.filter((id) => id !== badgeId),
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting event:", error)
      setError(error.response?.data?.message || "Failed to save event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background-beige rounded-xl shadow-md border border-border-light overflow-hidden mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-heading font-bold text-forest-green mb-6">{event ? "Edit Event" : "Create New Event"}</h2>

        {error && (
          <div className="bg-error border border-error text-white px-4 py-3 rounded mb-4 relative animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }} role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Details Section */}
          <div className="bg-background-light p-4 rounded-xl border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <h3 className="text-lg font-heading font-medium text-forest-green mb-4 pb-2 border-b border-border-light">Event Details</h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Event Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Outing">Outing</option>
                  <option value="Camp">Camp</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-sans font-medium text-text-primary mb-1">
                    Start Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-sans font-medium text-text-primary mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-sans font-medium text-text-primary mb-1">
                    Start Time (Optional)
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-sans font-medium text-text-primary mb-1">
                    End Time (Optional)
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Cost (Optional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-text-secondary sm:text-sm">£</span>
                  </div>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="pl-7 block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-background-light p-4 rounded-xl border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "300ms" }}>
            <h3 className="text-lg font-heading font-medium text-forest-green mb-4 pb-2 border-b border-border-light">Location</h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label htmlFor="locationName" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  id="locationName"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="locationAddress" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Address
                </label>
                <textarea
                  id="locationAddress"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleChange}
                  rows="2"
                  className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-sans font-medium text-text-primary mb-1">
                    Latitude (Optional)
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-sans font-medium text-text-primary mb-1">
                    Longitude (Optional)
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Helpers Section */}
          <div className="bg-background-light p-4 rounded-xl border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "400ms" }}>
            <h3 className="text-lg font-heading font-medium text-forest-green mb-4 pb-2 border-b border-border-light">Helpers</h3>

            <div>
              <label htmlFor="requiredHelpers" className="block text-sm font-sans font-medium text-text-primary mb-1">
                Number of Helpers Required
              </label>
              <input
                type="number"
                id="requiredHelpers"
                name="requiredHelpers"
                value={formData.requiredHelpers}
                onChange={handleChange}
                min="0"
                className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
              />
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-background-light p-4 rounded-xl border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "500ms" }}>
            <h3 className="text-lg font-heading font-medium text-forest-green mb-4 pb-2 border-b border-border-light">Badges</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {badges.map((badge) => (
                <label
                  key={badge.id}
                  className="inline-flex items-center bg-background-light p-3 rounded-md border border-border-light hover:bg-primary-light transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    value={badge.id}
                    checked={formData.badgeIds.includes(badge.id)}
                    onChange={handleBadgeChange}
                    className="h-4 w-4 text-forest-green focus:ring-forest-green border-border-light rounded"
                  />
                  <span className="ml-2 text-sm font-sans text-text-primary">{badge.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Visibility Section */}
          <div className="bg-background-light p-4 rounded-xl border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "600ms" }}>
            <h3 className="text-lg font-heading font-medium text-forest-green mb-4 pb-2 border-b border-border-light">Visibility</h3>

            <div className="space-y-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="publicVisible"
                  checked={formData.publicVisible}
                  onChange={handleChange}
                  className="rounded border-border-light text-forest-green shadow-sm focus:border-forest-green focus:ring focus:ring-forest-green focus:ring-opacity-50 h-4 w-4"
                />
                <span className="ml-2 text-gray-700 font-sans text-text-primary">Visible to Public</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="helpersOnlyVisible"
                  checked={formData.helpersOnlyVisible}
                  onChange={handleChange}
                  className="rounded border-border-light text-forest-green shadow-sm focus:border-forest-green focus:ring focus:ring-forest-green focus:ring-opacity-50 h-4 w-4"
                />
                <span className="ml-2 text-gray-700 font-sans text-text-primary">Visible to Helpers Only</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="leadersOnlyVisible"
                  checked={formData.leadersOnlyVisible}
                  onChange={handleChange}
                  className="rounded border-border-light text-forest-green shadow-sm focus:border-forest-green focus:ring focus:ring-forest-green focus:ring-opacity-50 h-4 w-4"
                />
                <span className="ml-2 text-gray-700 font-sans text-text-primary">Visible to Leaders Only</span>
              </label>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-background-light p-4 rounded-xl border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "700ms" }}>
            <h3 className="text-lg font-heading font-medium text-forest-green mb-4 pb-2 border-b border-border-light">
              Additional Information (Leaders Only)
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div>
                <label htmlFor="notes" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label htmlFor="equipment" className="block text-sm font-sans font-medium text-text-primary mb-1">
                  Equipment Needed
                </label>
                <textarea
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "800ms" }}>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-border-light shadow-sm text-sm font-heading font-medium text-text-primary bg-background-light hover:bg-background-beige focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-heading font-medium text-white bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span>
                  Saving...
                </>
              ) : event ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm