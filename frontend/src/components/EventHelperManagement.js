"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"

const EventHelperManagement = ({ eventId }) => {
  const [event, setEvent] = useState(null)
  const [availableHelpers, setAvailableHelpers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const eventResponse = await api.get(`/events/${eventId}`)
        setEvent(eventResponse.data.event)

        if (eventResponse.data.event.startDate && eventResponse.data.event.startTime) {
          const helpersResponse = await api.get(
            `/events/${eventId}/available-helpers?eventDate=${eventResponse.data.event.startDate}&startTime=${eventResponse.data.event.startTime}&endTime=${eventResponse.data.event.endTime || eventResponse.data.event.startTime}`,
          )
          setAvailableHelpers(helpersResponse.data.helpers || [])
        }
      } catch (error) {
        console.error("Error fetching event data:", error)
        setError("Failed to load event data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventId])

  const handleAssignHelper = async (helperId) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await api.post("/events/helpers", {
        eventId,
        helperId,
        confirmed: true,
      })

      const eventResponse = await api.get(`/events/${eventId}`)
      setEvent(eventResponse.data.event)

      setSuccess("Helper assigned successfully")
    } catch (error) {
      console.error("Error assigning helper:", error)
      setError(error.response?.data?.message || "Failed to assign helper")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveHelper = async (helperId) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await api.delete(`/events/${eventId}/helpers/${helperId}`)

      const eventResponse = await api.get(`/events/${eventId}`)
      setEvent(eventResponse.data.event)

      setSuccess("Helper removed successfully")
    } catch (error) {
      console.error("Error removing helper:", error)
      setError(error.response?.data?.message || "Failed to remove helper")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmHelper = async (helperId, confirmed) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await api.put(`/events/${eventId}/helpers/${helperId}`, {
        confirmed,
      })

      const eventResponse = await api.get(`/events/${eventId}`)
      setEvent(eventResponse.data.event)

      setSuccess(`Helper ${confirmed ? "confirmed" : "unconfirmed"} successfully`)
    } catch (error) {
      console.error("Error updating helper confirmation:", error)
      setError(error.response?.data?.message || "Failed to update helper confirmation")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !event) {
    return (
      <div className="flex justify-center items-center py-12 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
        </div>
        <span className="ml-4 text-lg font-sans text-forest-green font-medium">Loading event data...</span>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="bg-error border border-error text-white px-4 py-3 rounded relative mx-auto max-w-2xl animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }} role="alert">
        <span className="block sm:inline font-sans">{error}</span>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="bg-error border border-error text-white px-4 py-3 rounded relative mx-auto max-w-2xl animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }} role="alert">
        <span className="block sm:inline font-sans">Event not found</span>
      </div>
    )
  }

  const assignedHelperIds = event.helpers ? event.helpers.map((helper) => helper.id) : []
  const unassignedHelpers = availableHelpers.filter((helper) => !assignedHelperIds.includes(helper.id))

  return (
    <div className="bg-background-light rounded-lg shadow-md border border-border-light overflow-hidden mx-auto max-w-4xl animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-heading font-bold text-forest-green mb-6">Helper Management for {event.title}</h2>

        {error && (
          <div className="bg-error border-l-4 border-error text-white px-4 py-3 rounded mb-4 relative animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }} role="alert">
            <span className="block sm:inline font-sans">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-primary-light border-l-4 border-forest-green text-text-primary px-4 py-3 rounded mb-4 relative animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }} role="alert">
            <span className="block sm:inline font-sans">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-forest-green mb-3 flex items-center">
              Assigned Helpers
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-primary-light text-forest-green">
                {event.helpers ? event.helpers.length : 0}
              </span>
            </h3>

            <div className="bg-background-beige rounded-lg border border-border-light p-4">
              {event.helpers && event.helpers.length > 0 ? (
                <div className="space-y-3">
                  {event.helpers.map((helper) => (
                    <div key={helper.id} className="bg-background-light rounded-lg border border-border-light p-3 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-2 sm:mb-0">
                          <div className="font-medium text-text-primary font-sans">
                            {helper.firstName} {helper.lastName}
                          </div>
                          <div className="text-text-secondary text-sm font-sans">{helper.email}</div>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium mt-1 ${helper.confirmed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {helper.confirmed ? "Confirmed" : "Pending Confirmation"}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!helper.confirmed ? (
                            <button
                              onClick={() => handleConfirmHelper(helper.id, true)}
                              className="inline-flex items-center px-3 py-1 border border-transparent rounded text-xs font-sans font-medium text-white bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green"
                              disabled={loading}
                            >
                              Confirm
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConfirmHelper(helper.id, false)}
                              className="inline-flex items-center px-3 py-1 border border-border-light rounded text-xs font-sans font-medium text-text-primary bg-background-beige hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green"
                              disabled={loading}
                            >
                              Unconfirm
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveHelper(helper.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded text-xs font-sans font-medium text-white bg-primary-dark hover:bg-forest-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-text-secondary font-sans">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-accent-light mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p>No helpers assigned to this event yet</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-semibold text-forest-green mb-3 flex items-center">
              Available Helpers
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-primary-light text-forest-green">
                {unassignedHelpers.length}
              </span>
            </h3>

            <div className="bg-background-beige rounded-lg border border-border-light p-4">
              {!event.startDate || !event.startTime ? (
                <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded font-sans">
                  Please set event date and time to see available helpers
                </div>
              ) : unassignedHelpers.length > 0 ? (
                <div className="space-y-3">
                  {unassignedHelpers.map((helper) => (
                    <div key={helper.id} className="bg-background-light rounded-lg border border-border-light p-3 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="mb-2 sm:mb-0">
                          <div className="font-medium text-text-primary font-sans">
                            {helper.firstName} {helper.lastName}
                          </div>
                          <div className="text-text-secondary text-sm font-sans">{helper.email}</div>
                          <div className="mt-1 flex space-x-2">
                            {helper.disclosureStatus && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-sans font-medium bg-green-100 text-green-800">
                                Disclosure
                              </span>
                            )}
                            {helper.trainingCompleted && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-sans font-medium bg-blue-100 text-blue-800">
                                Training
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignHelper(helper.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent rounded text-xs font-sans font-medium text-white bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green"
                          disabled={loading}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-text-secondary font-sans">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-accent-light mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <p>No additional helpers available for this time slot</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventHelperManagement