"use client"

import { useState, useEffect, useRef } from "react"

const EventList = ({ events, onEventSelect }) => {
  const [sortBy, setSortBy] = useState("date") 
  const listRef = useRef(null)
  console.log("Events received:", events);


  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
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

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.startDate) - new Date(b.startDate)
    } else {
      return a.title.localeCompare(b.title)
    }
  })
  

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-background-beige rounded-2xl shadow-md border border-border-light animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
        <h3 className="text-lg sm:text-lg font-heading font-bold text-text-secondary mb-2">No events found</h3>
        <p className="text-text-primary max-w-md text-center">
          There are no events matching your current filters. Try adjusting your search criteria or check back later.
        </p>
      </div>
    )
  }

  return (
    <div ref={listRef} className="bg-background-beige rounded-2xl shadow-md border border-border-light overflow-hidden animate-on-scroll  transition-all duration-700 translate-y-8">
      <div className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-forest-green/20 to-scout-green/20 border-b border-border-light">
        <div className="text-forest-green font-heading font-bold">{events.length} adventures waiting for you</div>
        <div className="flex items-center">
          <label htmlFor="sort-select" className="text-base font-heading text-text-primary mr-2">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-base font-sans border border-border-light rounded-lg shadow-sm focus:ring-forest-green focus:border-forest-green bg-background-light transition-all duration-200"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {sortedEvents.map((event, index) => {
          const isUpcoming = new Date(event.startDate) > new Date()

          return (
            <div
              key={event.id}
              className={`group bg-background-light border border-border-light rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer animate-on-scroll  translate-y-8`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => onEventSelect(event.id)}
            >
              <div className="relative h-40 bg-gradient-to-r from-forest-green to-primary-dark overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-background-light rounded-lg shadow-md p-2 text-center min-w-[60px] border border-border-light">
                  <div className="text-2xl font-bold text-forest-green">{new Date(event.startDate).getDate()}</div>
                  <div className="text-xs font-medium text-forest-green">
                    {new Date(event.startDate).toLocaleString("default", { month: "short" })}
                  </div>
                </div>

                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getEventTypeColor(event.eventType)}`}
                >
                  {event.eventType}
                </div>

                <h3 className="absolute bottom-3 left-4 right-4 text-white font-heading font-bold text-2xl line-clamp-2">
                  {event.title}
                </h3>
              </div>

              <div className="p-4">
                <div className="flex items-start mb-3">
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
                  <span className="text-text-primary font-sans line-clamp-1">{event.locationName}</span>
                </div>

                {event.startTime && (
                  <div className="flex items-start mb-3">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-text-primary font-sans">
                      {formatTime(event.startTime)}
                      {event.endTime && ` - ${formatTime(event.endTime)}`}
                    </span>
                  </div>
                )}

                {event.description && (
                  <p className="text-text-primary font-sans text-sm mb-4 line-clamp-2">{event.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center text-xs bg-background-beige text-text-primary px-2 py-1 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-text-secondary"
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
                    {event.helperCount || 0}/{event.requiredHelpers}
                  </div>

                  {event.maxParticipants > 0 && (
                    <div className="flex items-center text-xs bg-background-beige text-text-primary px-2 py-1 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      {event.participantCount || 0}/{event.maxParticipants}
                    </div>
                  )}

                  {event.badgeCount > 0 && (
                    <div className="flex items-center text-xs bg-background-beige text-text-primary px-2 py-1 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      {event.badgeCount}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border-light flex justify-end">
                  <button className="text-base font-heading font-medium text-forest-green hover:text-primary-dark group-hover:underline flex items-center transition-all duration-200">
                    View Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

export default EventList