"use client"

import { useState, useEffect } from "react"
import { getUserRole, isAuthenticated } from "../utils/auth"
import api from "../utils/api"

const EventDetail = ({ event, onBack, onEdit, onDelete, onManageHelpers, onManageAttendance, isVolunteered }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isVolunteeredState, setIsVolunteeredState] = useState(isVolunteered)
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const userRole = getUserRole()
  const isAuth = isAuthenticated()
  const isLeader = userRole === "leader" || userRole === "admin"
  const isHelper = userRole === "helper"

  useEffect(() => {
    const checkRegistration = async () => {
      if (isAuth && event) {
        try {
          const response = await api.get(`/events/${event.id}/register`)
          setIsRegistered(response.data.isRegistered)
        } catch (error) {
          console.error("Error checking registration:", error)
        }
      }
    }

    const checkVolunteered = async () => {
      if (isAuth && isHelper && event) {
        try {
          const userResponse = await api.get("/auth/user")
          const userId = userResponse.data.user.id
          const helperResponse = await api.get(`/helpers/user/${userId}`)
          const helperId = helperResponse.data.helper.id
          const isVolunteered = event.helpers && event.helpers.some((helper) => helper.id === helperId)
          setIsVolunteeredState(isVolunteered)
        } catch (error) {
          console.error("Error checking if volunteered:", error)
        }
      }
    }

    checkRegistration()
    checkVolunteered()
  }, [event, isAuth, isHelper])

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  const handleVolunteer = async () => {
    if (!isAuth || !isHelper) {
      setError("You must be logged in as a helper to volunteer")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await api.post(`/events/${event.id}/volunteer`)
      setSuccess("You have successfully volunteered for this event")
      setIsVolunteeredState(true)
    } catch (error) {
      console.error("Error volunteering for event:", error)
      setError(error.response?.data?.message || "Failed to volunteer for event")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!isAuth) {
      setError("You must be logged in to register for events")
      return
    }

    setRegistrationLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await api.post(`/events/${event.id}/register`)
      setSuccess("You have successfully registered for this event")
      setIsRegistered(true)
    } catch (error) {
      console.error("Error registering for event:", error)
      setError(error.response?.data?.message || "Failed to register for event")
    } finally {
      setRegistrationLoading(false)
    }
  }

  const handleCancelRegistration = async () => {
    if (!isAuth) {
      setError("You must be logged in to cancel registration")
      return
    }

    if (!window.confirm("Are you sure you want to cancel your registration?")) {
      return
    }

    setRegistrationLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await api.delete(`/events/${event.id}/register`)
      setSuccess("Your registration has been cancelled")
      setIsRegistered(false)
    } catch (error) {
      console.error("Error cancelling registration:", error)
      setError(error.response?.data?.message || "Failed to cancel registration")
    } finally {
      setRegistrationLoading(false)
    }
  }

  const getEventTypeColor = (eventType) => {
    const colors = {
      Meeting: "bg-primary-light text-primary-dark",
      Outing: "bg-accent-light text-accent-dark",
      Camp: "bg-success text-forest-green",
      Training: "bg-background-light text-text-primary",
      Other: "bg-border-light text-text-secondary",
    }
    return colors[eventType] || "bg-primary-light text-primary-dark"
  }

  return (
    <div className="bg-background-beige rounded-2xl shadow-md border border-border-light overflow-hidden">
      <div
        className="relative h-64 bg-gradient-to-r from-forest-green to-primary-dark overflow-hidden animate-on-scroll  transition-all duration-700 translate-y-8"
        style={{ transitionDelay: "0ms" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-forest-green/80 to-primary-dark/80"></div>

        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 flex items-center justify-center w-12 h-12 bg-background-light/30 border border-border-light rounded-full text-white hover:bg-background-light/50 backdrop-blur-sm transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getEventTypeColor(event.eventType)}`}
          >
            {event.eventType}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 drop-shadow-lg">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(event.startDate)}
              {event.endDate && event.endDate !== event.startDate && <span> to {formatDate(event.endDate)}</span>}
            </div>
            {event.startTime && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTime(event.startTime)}
                {event.endTime && ` - ${formatTime(event.endTime)}`}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div
            className="bg-error border-l-4 border-error text-white p-4 mb-6 rounded-xl animate-on-scroll  transition-all duration-700 translate-y-8"
            style={{ transitionDelay: "100ms" }}
            role="alert"
          >
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
            className="bg-success border-l-4 border-forest-green text-white p-4 mb-6 rounded-xl animate-on-scroll  transition-all duration-700 translate-y-8"
            style={{ transitionDelay: "100ms" }}
            role="alert"
          >
            <div className="flex">
              <svg
                className="h-5 w-5 text-white mr-2"
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

        <div
          className="border-b border-border-light mb-6 animate-on-scroll  transition-all duration-700 translate-y-8"
          style={{ transitionDelay: "200ms" }}
        >
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-6 px-2 border-b-2 font-heading font-bold text-base ${
                activeTab === "details"
                  ? "border-forest-green text-forest-green"
                  : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
              }`}
            >
              Details
            </button>
            {event.badges && event.badges.length > 0 && (
              <button
                onClick={() => setActiveTab("badges")}
                className={`py-6 px-2 border-b-2 font-heading font-bold text-base ${
                  activeTab === "badges"
                    ? "border-forest-green text-forest-green"
                    : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
                }`}
              >
                Badges
              </button>
            )}
            {isLeader && event.participants && event.participants.length > 0 && (
              <button
                onClick={() => setActiveTab("participants")}
                className={`py-6 px-2 border-b-2 font-heading font-bold text-base ${
                  activeTab === "participants"
                    ? "border-forest-green text-forest-green"
                    : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
                }`}
              >
                Participants
              </button>
            )}
            {isLeader && event.helpers && event.helpers.length > 0 && (
              <button
                onClick={() => setActiveTab("helpers")}
                className={`py-6 px-2 border-b-2 font-heading font-bold text-base ${
                  activeTab === "helpers"
                    ? "border-forest-green text-forest-green"
                    : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
                }`}
              >
                Helpers
              </button>
            )}
          </nav>
        </div>

        {activeTab === "details" && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll  transition-all duration-700 translate-y-8"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-bold text-forest-green mb-3">About This Event</h3>
                <div className="bg-background-light p-4 rounded-xl border border-border-light">
                  {event.description ? (
                    <div className="prose max-w-none text-text-primary font-sans whitespace-pre-line">{event.description}</div>
                  ) : (
                    <p className="text-text-secondary italic">No description provided</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-forest-green mb-3">Location</h3>
                <div className="bg-background-light p-4 rounded-xl border border-border-light">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-forest-green mt-0.5 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <div className="font-bold text-text-primary">{event.locationName}</div>
                      {event.locationAddress && <div className="text-text-primary mt-1">{event.locationAddress}</div>}
                    </div>
                  </div>

                  <div className="mt-4 bg-background-beige h-40 rounded-xl flex items-center justify-center">
                    <span className="text-text-secondary">Map would be displayed here</span>
                  </div>
                </div>
              </div>

              {event.cost && (
                <div>
                  <h3 className="text-lg font-heading font-bold text-forest-green mb-3">Cost</h3>
                  <div className="bg-background-light p-4 rounded-xl border border-border-light">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-forest-green mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-xl font-bold text-text-primary">
                        £{Number.parseFloat(event.cost).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {(event.notes || event.equipment) && isLeader && (
                <>
                  {event.notes && (
                    <div>
                      <h3 className="text-lg font-heading font-bold text-forest-green mb-3">Leader Notes</h3>
                      <div className="bg-background-light p-4 rounded-xl border border-border-light whitespace-pre-line text-text-primary font-sans">
                        {event.notes}
                      </div>
                    </div>
                  )}

                  {event.equipment && (
                    <div>
                      <h3 className="text-lg font-heading font-bold text-forest-green mb-3">Equipment Needed</h3>
                      <div className="bg-background-light p-4 rounded-xl border border-border-light">
                        <ul className="space-y-2">
                          {event.equipment.split("\n").map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-forest-green mr-2 mt-0.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-text-primary font-sans">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <h3 className="text-lg font-heading font-bold text-forest-green mb-3">Event Details</h3>
                <div className="bg-background-light p-4 rounded-xl border border-border-light space-y-4">
                  <div className="flex justify-between">
                    <span className="text-text-primary font-sans">Required Helpers:</span>
                    <span className="font-bold text-text-primary">{event.requiredHelpers}</span>
                  </div>

                  {event.maxParticipants > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-primary font-sans">Maximum Participants:</span>
                      <span className="font-bold text-text-primary">{event.maxParticipants}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-text-primary font-sans">Current Participants:</span>
                    <span className="font-bold text-text-primary">
                      {event.participants ? event.participants.length : 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-primary font-sans">Current Helpers:</span>
                    <span className="font-bold text-text-primary">{event.helpers ? event.helpers.length : 0}</span>
                  </div>

                  {event.badges && event.badges.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-primary font-sans">Badges Available:</span>
                      <span className="font-bold text-text-primary">{event.badges.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {event.creator && (
                <div>
                  <h3 className="text-lg font-heading font-bold text-forest-green mb-3">Organized By</h3>
                  <div className="bg-background-light p-4 rounded-xl border border-border-light">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-dark font-bold">
                          {event.creator.firstName.charAt(0)}
                          {event.creator.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">
                          {event.creator.firstName} {event.creator.lastName}
                        </div>
                        <div className="text-sm text-text-secondary">Event Organizer</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

       {activeTab === "badges" && event.badges && event.badges.length > 0 && (
  <div
    className="animate-on-scroll transition-all duration-700 translate-y-8"
    style={{ transitionDelay: "300ms" }}
  >
    <h3 className="text-lg font-heading font-bold text-forest-green mb-4">
      Badges Available at This Event
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {event.badges.map((badge, index) => (
        <div
          key={badge.id}
          className="bg-background-light p-4 rounded-xl border border-border-light shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg  bg-background-beige flex items-center justify-center mr-4 p-2">
              {badge.imageUrl ? (
                <img
                  src={`http://localhost:5000${badge.imageUrl}`}
                  alt={badge.name}
                  className="w-full h-full object-contain min-w-[40px] min-h-[40px]" // Минимальный размер изображения
                  loading="lazy"
                  onError={(e) => {
                    console.log(`Failed to load badge image: ${badge.imageUrl}`);
                    e.target.onerror = null;
                    e.target.src = "/placeholder-badge.png";
                  }}
                />
              ) : (
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-text-secondary bg-background-light rounded-full w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                  {badge.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-heading font-bold text-text-primary text-sm sm:text-base">
                {badge.name}
              </h4>
              <p className="text-xs sm:text-sm text-text-primary font-sans mt-1 line-clamp-2">
                {badge.description || "No description available"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {activeTab === "participants" && isLeader && event.participants && event.participants.length > 0 && (
          <div
            className="animate-on-scroll  transition-all duration-700 translate-y-8"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-heading font-bold text-forest-green">
                Participants ({event.participants.length})
              </h3>
              <button
                onClick={() => onManageAttendance(event.id)}
                className="inline-flex items-center px-6 py-3 border border-border-light shadow-sm text-base font-heading font-bold text-text-primary bg-background-light hover:bg-background-beige hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Manage Attendance
              </button>
            </div>

            <div className="bg-background-light rounded-xl border border-border-light overflow-hidden">
              <div className="grid grid-cols-1 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                {event.participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="flex justify-between items-center bg-background-light p-3 rounded-xl border border-border-light shadow-sm hover:scale-105 transition-all duration-200"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-dark font-bold">
                          {participant.firstName.charAt(0)}
                          {participant.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="font-bold text-text-primary">
                        {participant.firstName} {participant.lastName}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-md text-sm font-bold ${
                        participant.status === "confirmed"
                          ? "bg-success text-forest-green"
                          : participant.status === "pending"
                            ? "bg-warning text-warning"
                            : "bg-border-light text-text-secondary"
                      }`}
                    >
                      {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "helpers" && isLeader && event.helpers && event.helpers.length > 0 && (
  <div
    className="animate-on-scroll transition-all duration-700 translate-y-8"
    style={{ transitionDelay: "300ms" }}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-heading font-bold text-forest-green">
        Helpers ({event.helpers.length})
      </h3>
      <button
        onClick={() => onManageHelpers(event.id)}
        className="inline-flex items-center px-6 py-3 border border-border-light shadow-sm text-base font-heading font-bold text-text-primary bg-background-light hover:bg-background-beige hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Manage Helpers
      </button>
    </div>

    <div className="bg-background-light rounded-xl border border-border-light overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 max-w-full">
        {event.helpers.map((helper, index) => (
          <div
            key={helper.id}
            className="flex justify-between items-center bg-background-light p-3 rounded-xl border border-border-light shadow-sm hover:scale-105 transition-all duration-200 whitespace-nowrap overflow-hidden"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center min-w-0">
              <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-accent-dark font-bold">
                  {helper.firstName.charAt(0)}
                  {helper.lastName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-text-primary truncate">{helper.firstName} {helper.lastName}</div>
                <div className="text-sm text-text-secondary truncate">{helper.email}</div>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-md text-sm font-bold white ${
                helper.confirmed ? "bg-success " : "bg-warning text-warning"
              } whitespace-nowrap`}
            >
              {helper.confirmed ? "Confirmed" : "Pending"}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        <div
          className="mt-8 pt-6 border-t border-border-light flex flex-wrap gap-3 animate-on-scroll  transition-all duration-700 translate-y-8"
          style={{ transitionDelay: "400ms" }}
        >
          {isLeader && (
            <>
              <button
                onClick={() => onEdit(event.id)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-heading font-bold text-white bg-forest-green hover:bg-primary-dark hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Event
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-heading font-bold text-white bg-error hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Event
              </button>
              <button
                onClick={() => onManageHelpers(event.id)}
                className="inline-flex items-center px-6 py-3 border border-border-light rounded-xl shadow-sm text-base font-heading font-bold text-text-primary bg-background-light hover:bg-background-beige hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Manage Helpers
              </button>
              <button
                onClick={() => onManageAttendance(event.id)}
                className="inline-flex items-center px-6 py-3 border border-border-light rounded-xl shadow-sm text-base font-heading font-bold text-text-primary bg-background-light hover:bg-background-beige hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 40"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Manage Attendance
              </button>
            </>
          )}

          {isHelper && !isVolunteeredState && (
            <button
              onClick={handleVolunteer}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-heading font-bold text-white bg-forest-green hover:bg-primary-dark hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block h-5 w-5 mr-2 border-t-2 border-white rounded-full"></span>
                  Volunteering...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                    />
                  </svg>
                  Volunteer to Help
                </>
              )}
            </button>
          )}

          {isHelper && isVolunteeredState && (
            <div className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-light text-primary-dark border border-border-light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You have volunteered for this event
            </div>
          )}

          {isAuth && !isLeader && !isHelper && !isRegistered && (
            <button
              onClick={handleRegister}
              disabled={registrationLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-heading font-bold text-white bg-forest-green hover:bg-primary-dark hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green disabled:opacity-50 transition-all duration-200"
            >
              {registrationLoading ? (
                <>
                  <span className="animate-spin inline-block h-5 w-5 mr-2 border-t-2 border-white rounded-full"></span>
                  Registering...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Register for Event
                </>
              )}
            </button>
          )}

          {isAuth && !isLeader && !isHelper && isRegistered && (
            <button
              onClick={handleCancelRegistration}
              disabled={registrationLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-heading font-bold text-white bg-error hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error disabled:opacity-50 transition-all duration-200"
            >
              {registrationLoading ? (
                <>
                  <span className="animate-spin inline-block h-5 w-5 mr-2 border-t-2 border-white rounded-full"></span>
                  Cancelling...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                    />
                  </svg>
                  Cancel Registration
                </>
              )}
            </button>
          )}

          {!isAuth && (
            <div className="inline-flex items-center px-6 py-3 rounded-xl bg-background-light text-text-primary border border-border-light">
              Please{" "}
              <a href="/login" className="text-forest-green hover:text-primary-dark font-bold mx-1">
                log in
              </a>{" "}
              to register for this event
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetail