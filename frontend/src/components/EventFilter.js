"use client"

import { useState, useEffect, useCallback } from "react"
import api from "../utils/api"

const EventFilter = ({ onFilterChange }) => {
  const [eventTypes, setEventTypes] = useState([])
  const [selectedType, setSelectedType] = useState("")
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [showPast, setShowPast] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchEventTypes = async () => {
      try {
        setLoading(true)
        const response = await api.get("/events", {
          signal: controller.signal,
        })

        if (response.data && Array.isArray(response.data.events)) {
          const types = [...new Set(response.data.events.map((event) => event.eventType))].filter(Boolean)
          setEventTypes(types)
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching event types:", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchEventTypes()

    return () => {
      controller.abort()
    }
  }, [])

  const applyFilters = useCallback(() => {
    const filters = {
      upcoming: showUpcoming,
      past: showPast,
      eventType: selectedType,
      startDate,
      endDate,
    }
    onFilterChange(filters)
  }, [showUpcoming, showPast, selectedType, startDate, endDate, onFilterChange])

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      return
    }
    applyFilters()
  }, [initialized, applyFilters])

  const handleClearFilters = () => {
    setSelectedType("")
    setShowUpcoming(true)
    setShowPast(false)
    setStartDate("")
    setEndDate("")
  }

  return (
    <div className="bg-background-beige rounded-xl shadow-md p-6 mb-6 border border-border-light animate-on-scroll  transition-all duration-700 translate-y-8">
      <div className="grid grid-cols-1 sm:gap-2 md:grid-cols-3 md:gap-4">
        <div className="space-y-2">
          <label className="block text-base sm:text-sm font-heading font-bold text-forest-green">
            Event Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full px-3 py-2 bg-background-light border border-border-light rounded-lg shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green hover:border-forest-green transition-all duration-200"
          >
            <option value="">All Types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-base sm:text-sm font-heading font-bold text-forest-green">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              className="block w-full px-3 py-2 bg-background-light border border-border-light rounded-lg shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green hover:border-forest-green transition-all duration-200"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              className="block w-full px-3 py-2 bg-background-light border border-border-light rounded-lg shadow-sm focus:outline-none focus:ring-forest-green focus:border-forest-green hover:border-forest-green transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-base sm:text-sm font-heading font-bold text-forest-green">
            Show Events
          </label>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showUpcoming}
                onChange={(e) => setShowUpcoming(e.target.checked)}
                className="h-5 w-5 rounded border-border-light text-forest-green focus:ring-forest-green focus:ring-opacity-50 mr-2 transition-transform duration-200 hover:scale-110"
              />
              <span className="text-text-primary">Upcoming</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={showPast}
                onChange={(e) => setShowPast(e.target.checked)}
                className="h-5 w-5 rounded border-border-light text-forest-green focus:ring-forest-green focus:ring-opacity-50 mr-2 transition-transform duration-200 hover:scale-110"
              />
              <span className="text-text-primary">Past</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="px-6 py-3 bg-forest-green hover:bg-primary-dark text-white text-base font-heading font-bold rounded-lg transition-all duration-200 hover:scale-105"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default EventFilter