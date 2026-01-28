// API Client Module
//
// Core Functionality:
// - Provides centralized API communication layer using Axios
// - Handles authentication token management for protected routes
// - Implements comprehensive error handling and logging
// - Exposes specialized functions for photo and event operations
//
// Request Handling:
// - Automatically attaches authentication tokens to requests
// - Identifies public routes that don't require authentication
// - Implements request interceptors for pre-request processing
// - Configures proper content types for different request types
//
// Response Processing:
// - Normalizes API responses for consistent data structure
// - Implements detailed error logging with status codes
// - Handles various error scenarios (response errors, network issues)
// - Provides meaningful error messages for client-side handling
//
// Specialized Endpoints:
// - Photo Management: fetch, retrieve, upload, update, delete
// - Event Retrieval: fetch events with filtering options
//
// Error Handling:
// - Implements consistent error response format
// - Provides detailed console logging for debugging
// - Handles canceled requests appropriately
// - Maintains promise rejection chain for error propagation
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    const isPublicRoute = config.url.startsWith("/announcements") || config.url.startsWith("/auth")

    if (token) {
      config.headers["x-auth-token"] = token
    } else if (!isPublicRoute) {
    }

    return config
  },
  (error) => {
    console.error("API Request Error:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data)
    } else if (error.request) {
      console.error("API Error: No response received", error.request)
    } else {
      console.error("API Error: Request setup failed", error.message)
    }
    return Promise.reject(error)
  },
)

export const getPhotos = async (endpoint = "") => {
  try {
    const response = await api.get(`/photos${endpoint}`)
    return {
      success: true,
      data: response.data.data || response.data.photos || [],
      message: response.data.message || "",
    }
  } catch (error) {
    console.error("API Error in getPhotos:", error.response?.data || error.message)
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Error fetching photos",
    }
  }
}

export const getPhotoById = async (id) => {
  try {
    const response = await api.get(`/photos/${id}`)
    return {
      success: true,
      data: response.data.data || response.data.photo,
      message: response.data.message || "",
    }
  } catch (error) {
    console.error("API Error in getPhotoById:", error.response?.data || error.message)
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Error fetching photo",
    }
  }
}

export const uploadPhoto = async (formData) => {
  try {
   

    const response = await api.post("/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return {
      success: true,
      data: response.data.data || response.data.photo,
      message: response.data.message || "Photo uploaded successfully",
    }
  } catch (error) {
    console.error("API Error in uploadPhoto:", error.response?.data || error.message)
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Error uploading photo",
    }
  }
}

export const updatePhoto = async (photoId, formData) => {
  try {
    if (!photoId) {
      throw new Error("Photo ID is required")
    }
    const response = await api.put(`/photos/${photoId}`, formData, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("API Error in updatePhoto:", error.response?.data || error.message)
    throw error.response?.data || error
  }
}

export const deletePhoto = async (photoId) => {
  try {
    if (!photoId) {
      throw new Error("Photo ID is required")
    }
    const response = await api.delete(`/photos/${photoId}`, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    })
    return response.data
  } catch (error) {
    console.error("API Error in deletePhoto:", error.response?.data || error.message)
    throw error.response?.data || error
  }
}

export const getEvents = async (options = {}) => {
  try {
    const response = await api.get("/events", options)
    return {
      success: true,
      data: response.data.data || response.data.events || [],
      message: response.data.message || "",
    }
  } catch (error) {
    if (error.name !== "CanceledError") {
      console.error("API Error in getEvents:", error.response?.data || error.message)
    }
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Error fetching events",
    }
  }
}

export default api