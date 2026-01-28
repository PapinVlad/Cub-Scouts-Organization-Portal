"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { isAuthenticated, getUserRole } from "../utils/auth"
import BadgeForm from "../components/BadgeForm"
import api from "../utils/api"

const EditBadge = () => {
  const [badge, setBadge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login")
      return
    }

    const userRole = getUserRole()
    if (userRole !== "admin" && userRole !== "leader") {
      navigate("/")
      return
    }

    const fetchBadge = async () => {
      try {
        const response = await api.get(`/badges/${id}`)
        setBadge(response.data.badge)
      } catch (error) {
        console.error("Error fetching badge:", error)
        setError("Failed to load icon")
      } finally {
        setLoading(false)
      }
    }

    fetchBadge()
  }, [navigate, id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Editing Badge</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Editing Badge</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/admin/badges")}
          className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Back to Badges
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Editing Badge</h1>
      <BadgeForm badge={badge} isEditing={true} />
    </div>
  )
}

export default EditBadge
