"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"
import { useScrollAnimation } from "../hooks/useScrollAnimation"

const BadgeForm = ({ badge = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    difficultyLevel: 1,
    requirements: [],
    activities: [],
  })
  const [newRequirement, setNewRequirement] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/badges/categories")
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories)
        } else {
          console.error("Unexpected categories format:", response.data)
          setCategories([])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      }
    }

    fetchCategories()

    if (isEditing && badge) {
      setFormData({
        name: badge.name || "",
        category: badge.category || "",
        description: badge.description || "",
        difficultyLevel: badge.difficultyLevel || 1,
        requirements: Array.isArray(badge.requirements) ? badge.requirements : [],
        activities: Array.isArray(badge.activities) ? badge.activities : [],
      })

      if (badge.imageUrl) {
        setImagePreview(`http://localhost:5000${badge.imageUrl}`)
      }
    }
  }, [isEditing, badge])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const addActivity = () => {
    if (newActivity.trim()) {
      setFormData((prev) => ({
        ...prev,
        activities: [...prev.activities, newActivity.trim()],
      }))
      setNewActivity("")
    }
  }

  const removeActivity = (index) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("category", formData.category === "new" ? formData.newCategory : formData.category)
      formDataObj.append("description", formData.description)
      formDataObj.append("difficultyLevel", formData.difficultyLevel)
      formDataObj.append("requirements", JSON.stringify(formData.requirements))
      formDataObj.append("activities", JSON.stringify(formData.activities))

      if (image) {
        formDataObj.append("image", image)
      }

      let response
      if (isEditing) {
        response = await api.put(`/badges/${badge.id}`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      } else {
        response = await api.post("/badges", formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      setLoading(false)
      navigate("/admin/badges")
    } catch (error) {
      setLoading(false)
      console.error("Error saving badge:", error)
      setError(error.response?.data?.message || "Error saving badge")
    }
  }
  useScrollAnimation(loading)
  return (
    <div className="bg-background-light rounded-lg shadow-md p-6 max-w-3xl mx-auto animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "0ms" }}>
      <h2 className="text-2xl font-heading font-bold text-forest-green mb-6">
        {isEditing ? "Edit Badge" : "Create New Badge"}
      </h2>

      {error && (
        <div className="bg-error border-l-4 border-error text-white p-4 mb-6 rounded animate-on-scroll opacity-0 transition-all duration-700 translate-y-8" style={{ transitionDelay: "100ms" }}>
          <p className="font-sans">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-sans font-medium text-text-primary mb-1">
                Badge Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-sans font-medium text-text-primary mb-1">
                Category
              </label>
              <div className="space-y-2">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
                {formData.category === "new" && (
                  <input
                    type="text"
                    placeholder="Enter new category"
                    value={formData.newCategory || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newCategory: e.target.value }))}
                    required
                    className="block w-full rounded-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                  />
                )}
              </div>
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
                className="block w-full rounded-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
              ></textarea>
            </div>

            <div>
              <label htmlFor="difficultyLevel" className="block text-sm font-sans font-medium text-text-primary mb-1">
                Difficulty Level
              </label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="block w-full rounded-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
              >
                <option value="1">1 - Very Easy</option>
                <option value="2">2 - Easy</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - Hard</option>
                <option value="5">5 - Very Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="image" className="block text-sm font-sans font-medium text-text-primary mb-1">
                Badge Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-light file:text-forest-green hover:file:bg-forest-green hover:file:text-white"
              />
              {imagePreview && (
                <div className="mt-2 border border-border-light rounded-md p-2 bg-background-beige flex items-center justify-center" style={{ height: "160px" }}>
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Badge Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-text-primary mb-2">Requirements</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Enter requirement"
                  className="flex-1 rounded-l-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="bg-forest-green hover:bg-primary-dark text-white font-sans font-medium py-2 px-4 rounded-r-md transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {formData.requirements.map((req, index) => (
                  <li key={index} className="flex items-center justify-between bg-background-beige p-2 rounded-md">
                    <span className="text-sm text-text-primary font-sans">{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-primary-dark hover:text-forest-green"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-text-primary mb-2">Recommended Activities</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Enter activity"
                  className="flex-1 rounded-l-md border border-border-light shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green bg-background-beige text-text-primary"
                />
                <button
                  type="button"
                  onClick={addActivity}
                  className="bg-forest-green hover:bg-primary-dark text-white font-sans font-medium py-2 px-4 rounded-r-md transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {formData.activities.map((activity, index) => (
                  <li key={index} className="flex items-center justify-between bg-background-beige p-2 rounded-md">
                    <span className="text-sm text-text-primary font-sans">{activity}</span>
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="text-primary-dark hover:text-forest-green"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-border-light">
          <button
            type="button"
            onClick={() => navigate("/admin/badges")}
            className="border border-border-light bg-background-beige text-text-primary hover:bg-primary-light font-sans font-medium py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-forest-green hover:bg-primary-dark text-white font-sans font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            {loading ? (
              <>
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
                Saving...
              </>
            ) : isEditing ? (
              "Update Badge"
            ) : (
              "Create Badge"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BadgeForm