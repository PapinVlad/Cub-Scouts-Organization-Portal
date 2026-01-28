"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"

const EventAttendance = ({ eventId }) => {
  const [event, setEvent] = useState(null)
  const [participants, setParticipants] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const eventResponse = await api.get(`/events/${eventId}`)
        setEvent(eventResponse.data.event)

        if (eventResponse.data.event.participants) {
          setParticipants(eventResponse.data.event.participants)
        }

        const attendanceResponse = await api.get(`/events/${eventId}/attendance`)
        setAttendance(attendanceResponse.data.attendance || [])
      } catch (error) {
        console.error("Error fetching attendance data:", error)
        setError("Failed to load attendance data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventId])

  const handleCheckIn = async (userId) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await api.post("/events/attendance", {
        eventId,
        userId,
        checkInTime: new Date(),
      })

      const attendanceResponse = await api.get(`/events/${eventId}/attendance`)
      setAttendance(attendanceResponse.data.attendance || [])

      setSuccess("Check-in recorded successfully")
    } catch (error) {
      console.error("Error recording check-in:", error)
      setError(error.response?.data?.message || "Failed to record check-in")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async (userId) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await api.put(`/events/${eventId}/attendance`, {
        userId,
        checkOutTime: new Date(),
      })

      const attendanceResponse = await api.get(`/events/${eventId}/attendance`)
      setAttendance(attendanceResponse.data.attendance || [])

      setSuccess("Check-out recorded successfully")
    } catch (error) {
      console.error("Error recording check-out:", error)
      setError(error.response?.data?.message || "Failed to record check-out")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !event) {
    return (
      <div className="flex justify-center items-center py-16 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
        </div>
        <span className="ml-4 text-lg font-sans text-forest-green font-medium">Loading attendance data...</span>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="bg-error border-l-4 border-error text-white p-4 rounded-lg animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }} role="alert">
        <div className="flex">
          <svg
            className="h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="bg-error border-l-4 border-error text-white p-4 rounded-lg animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }} role="alert">
        <div className="flex">
          <svg
            className="h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Event not found</span>
        </div>
      </div>
    )
  }

  const isCheckedIn = (userId) => {
    return attendance.some((record) => record.userId === userId && record.checkInTime)
  }

  const isCheckedOut = (userId) => {
    return attendance.some((record) => record.userId === userId && record.checkOutTime)
  }

  const getAttendanceRecord = (userId) => {
    return attendance.find((record) => record.userId === userId)
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not recorded"
    const date = new Date(dateTimeString)
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London",
    })
  }

  return (
    <div className="bg-background-beige rounded-xl shadow-md border border-border-light overflow-hidden animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-heading font-bold text-forest-green mb-6">
          Attendance for {event.title}
        </h2>

        {error && (
          <div className="bg-error border-l-4 border-error text-white p-4 rounded-lg mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }} role="alert">
            <div className="flex">
              <svg
                className="h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div
            className="bg-primary-light border-l-4 border-forest-green text-text-primary p-4 rounded-lg mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}
            role="alert"
          >
            <div className="flex">
              <svg
                className="h-5 w-5 text-forest-green mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-primary-light p-4 rounded-lg border border-border-light text-center animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "150ms" }}>
            <div className="text-3xl font-heading font-bold text-forest-green">{participants.length}</div>
            <div className="text-sm font-sans text-text-primary font-medium">Registered</div>
          </div>
          <div className="bg-primary-light p-4 rounded-lg border border-border-light text-center animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <div className="text-3xl font-heading font-bold text-forest-green">
              {attendance.filter((record) => record.checkInTime).length}
            </div>
            <div className="text-sm font-sans text-text-primary font-medium">Checked In</div>
          </div>
          <div className="bg-primary-light p-4 rounded-lg border border-border-light text-center animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "250ms" }}>
            <div className="text-3xl font-heading font-bold text-forest-green">
              {participants.length - attendance.filter((record) => record.checkInTime).length}
            </div>
            <div className="text-sm font-sans text-text-primary font-medium">No-Shows</div>
          </div>
        </div>

        <h3 className="text-xl font-heading font-semibold text-forest-green mb-4 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "300ms" }}>
          Participants
        </h3>

        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-background-light rounded-lg border border-border-light text-text-secondary animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "350ms" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-text-secondary mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-base font-sans">No participants registered for this event</p>
          </div>
        ) : (
          <div className="overflow-x-auto animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "400ms" }}>
            <table className="min-w-full divide-y divide-border-light">
              <thead className="bg-background-light">
                <tr>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-sans font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-sans font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-sans font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell"
                  >
                    Check-In
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-sans font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell"
                  >
                    Check-Out
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-right text-xs font-sans font-medium text-text-secondary uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background-beige divide-y divide-border-light">
                {participants.map((participant) => {
                  const checkedIn = isCheckedIn(participant.userId)
                  const checkedOut = isCheckedOut(participant.userId)
                  const record = getAttendanceRecord(participant.userId)

                  return (
                    <tr key={participant.id} className={checkedIn ? "bg-primary-light" : ""}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-sans font-medium text-text-primary">
                        {participant.firstName} {participant.lastName}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium
                          ${
                            participant.status === "confirmed"
                              ? "bg-forest-green text-white"
                              : participant.status === "pending"
                              ? "bg-accent-light text-text-primary"
                              : "bg-background-light text-text-secondary"
                          }`}
                        >
                          {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-sans text-text-primary hidden md:table-cell">
                        {record && record.checkInTime ? formatDateTime(record.checkInTime) : "Not checked in"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-sans text-text-primary hidden md:table-cell">
                        {record && record.checkOutTime ? formatDateTime(record.checkOutTime) : "Not checked out"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!checkedIn ? (
                          <button
                            onClick={() => handleCheckIn(participant.userId)}
                            disabled={loading}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-sans font-medium text-white bg-forest-green hover:bg-primary-dark focus:ring-forest-green focus:ring-offset-2 focus:ring-2 disabled:bg-background-light disabled:text-text-secondary"
                          >
                            Check In
                          </button>
                        ) : !checkedOut ? (
                          <button
                            onClick={() => handleCheckOut(participant.userId)}
                            disabled={loading}
                            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-sans font-medium text-white bg-primary-dark hover:bg-forest-green focus:ring-primary-dark focus:ring-offset-2 focus:ring-2 disabled:bg-background-light disabled:text-text-secondary"
                          >
                            Check Out
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-background-light border border-border-light rounded-md text-xs font-sans font-medium text-text-secondary">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventAttendance