"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"

const EventStatistics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview") // overview, types, monthly, helpers

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/events/statistics")
        setStats(response.data.stats)
      } catch (error) {
        console.error("Error fetching event statistics:", error)
        setError("Failed to load statistics. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-primary-light"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-forest-green border-t-transparent animate-spin"></div>
        </div>
        <span className="ml-4 text-lg font-sans text-forest-green font-medium">Loading statistics...</span>
      </div>
    )
  }

  if (error) {
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

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-background-light rounded-xl text-text-secondary animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-text-secondary mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-lg font-sans">No event statistics available</p>
      </div>
    )
  }

  // Format month names for display
  const getMonthName = (monthNum) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[monthNum - 1] || "Unknown"
  }

  return (
    <div className="bg-background-beige rounded-xl shadow-md border border-border-light overflow-hidden animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-heading font-bold text-forest-green mb-6">Event Statistics</h2>

        {/* Tabs Navigation */}
        <div className="border-b border-border-light mb-6 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
          <nav className="flex -mb-px space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 border-b-2 font-heading font-bold text-base ${
                activeTab === "overview"
                  ? "border-forest-green text-forest-green"
                  : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("types")}
              className={`py-4 px-2 border-b-2 font-heading font-bold text-base ${
                activeTab === "types"
                  ? "border-forest-green text-forest-green"
                  : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
              }`}
            >
              Event Types
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`py-4 px-2 border-b-2 font-heading font-bold text-base ${
                activeTab === "monthly"
                  ? "border-forest-green text-forest-green"
                  : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
              }`}
            >
              Monthly Trends
            </button>
            <button
              onClick={() => setActiveTab("helpers")}
              className={`py-4 px-2 border-b-2 font-heading font-bold text-base ${
                activeTab === "helpers"
                  ? "border-forest-green text-forest-green"
                  : "border-transparent text-text-primary hover:text-primary-dark hover:border-border-light hover:scale-105 transition-all duration-200"
              }`}
            >
              Helper Needs
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-forest-green to-primary-dark rounded-xl p-6 text-white shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary-light text-sm font-sans font-medium">Total Events</p>
                    <p className="text-4xl font-heading font-bold mt-2">{stats.total}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-dark to-forest-green rounded-xl p-6 text-white shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary-light text-sm font-sans font-medium">Upcoming Events</p>
                    <p className="text-4xl font-heading font-bold mt-2">{stats.upcoming}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent-dark to-accent-light rounded-xl p-6 text-white shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-sm font-sans font-medium">Total Participants</p>
                    <p className="text-4xl font-heading font-bold mt-2">{stats.totalParticipants || 0}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent-light to-accent-dark rounded-xl p-6 text-white shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-sm font-sans font-medium">Total Helpers</p>
                    <p className="text-4xl font-heading font-bold mt-2">{stats.totalHelpers || 0}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background-light rounded-xl border border-border-light shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-background-beige border-b border-border-light">
                  <h3 className="text-lg font-heading font-medium text-forest-green">Events by Type</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {stats.byType.map((item) => {
                      const percentage = (item.count / stats.total) * 100
                      return (
                        <div key={item.event_type} className="space-y-1">
                          <div className="flex justify-between text-sm font-sans text-text-primary">
                            <div>{item.event_type}</div>
                            <div>{percentage.toFixed(2)}% ({item.count})</div>
                          </div>
                          <div className="w-full bg-border-light rounded-full">
                            <div className="bg-primary-dark h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Types Tab */}
        {activeTab === "types" && (
          <div className="animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <div className="bg-background-light rounded-xl border border-border-light shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-background-beige border-b border-border-light">
                <h3 className="text-lg font-heading font-medium text-forest-green">Events by Type</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.byType && stats.byType.length > 0 ? (
                    stats.byType.map((item) => {
                      const percentage = (item.count / stats.total) * 100
                      return (
                        <div key={item.event_type} className="space-y-1">
                          <div className="flex justify-between text-sm font-sans text-text-primary">
                            <div>{item.event_type}</div>
                            <div>{percentage.toFixed(2)}% ({item.count} events)</div>
                          </div>
                          <div className="w-full bg-border-light rounded-full">
                            <div className="bg-primary-dark h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-text-secondary">No event types data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Trends Tab */}
        {activeTab === "monthly" && (
          <div className="animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <div className="bg-background-light rounded-xl border border-border-light shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-background-beige border-b border-border-light">
                <h3 className="text-lg font-heading font-medium text-forest-green">Monthly Event Trends</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.monthlyCounts && stats.monthlyCounts.length > 0 ? (
                    <>
                      {stats.monthlyCounts.map((item) => {
                        const maxCount = Math.max(...stats.monthlyCounts.map(i => i.count || 0), 1) // Default to 1 to avoid division by 0
                        const percentage = (item.count || 0) / maxCount * 100
                        return (
                          <div key={item.month} className="space-y-1">
                            <div className="flex justify-between text-sm font-sans text-text-primary">
                              <div>{getMonthName(item.month)}</div>
                              <div>{item.count || 0} events</div>
                            </div>
                            <div className="w-full bg-border-light rounded-full">
                              <div className="bg-forest-green h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <p className="text-center text-text-secondary">No monthly trends data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Helper Needs Tab */}
        {activeTab === "helpers" && (
          <div className="animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "200ms" }}>
            <div className="bg-background-light rounded-xl border border-border-light shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-background-beige border-b border-border-light">
                <h3 className="text-lg font-heading font-medium text-forest-green">Helper Needs</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.byType && stats.byType.length > 0 ? (
                    stats.byType.map((item) => {
                      const requiredHelpers = item.requiredHelpers || 0
                      const assignedHelpers = item.assignedHelpers || 0
                      const maxHelpers = Math.max(requiredHelpers, assignedHelpers, 1) // Avoid division by 0
                      const requiredPercentage = (requiredHelpers / maxHelpers) * 100
                      const assignedPercentage = (assignedHelpers / maxHelpers) * 100
                      return (
                        <div key={item.event_type} className="space-y-2">
                          <div className="text-sm font-sans font-medium text-text-primary">{item.event_type}</div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm font-sans text-text-primary">
                              <div>Required Helpers: {requiredHelpers}</div>
                              <div>{requiredPercentage.toFixed(2)}%</div>
                            </div>
                            <div className="w-full bg-border-light rounded-full">
                              <div className="bg-forest-green h-2 rounded-full" style={{ width: `${requiredPercentage}%` }}></div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm font-sans text-text-primary">
                              <div>Assigned Helpers: {assignedHelpers}</div>
                              <div>{assignedPercentage.toFixed(2)}%</div>
                            </div>
                            <div className="w-full bg-border-light rounded-full">
                              <div className="bg-accent-light h-2 rounded-full" style={{ width: `${assignedPercentage}%` }}></div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-text-secondary">No helper needs data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventStatistics