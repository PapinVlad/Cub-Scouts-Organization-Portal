// Authentication Module
//
// Core Functionality:
// - Manages user authentication workflow (register, login, logout)
// - Handles JWT token storage, validation, and parsing
// - Provides user identity and permission verification
// - Maintains persistent user sessions via localStorage
//
// Authentication Operations:
// - register: Creates new user accounts and establishes sessions
// - login: Authenticates existing users and stores session data
// - logout: Terminates user sessions and clears credentials
// - getCurrentUser: Retrieves current user profile information
//
// Security Features:
// - Validates token expiration to prevent session hijacking
// - Implements token parsing with error handling
// - Automatically clears invalid or expired tokens
// - Dispatches authentication change events for app-wide awareness
//
// Helper Functions:
// - isAuthenticated: Verifies valid, non-expired authentication
// - getUserRole: Extracts role information for authorization checks
// - getUserId: Retrieves user identifier for personalized operations
// - parseToken: Decodes JWT tokens to extract payload data
//
// Error Handling:
// - Implements comprehensive error logging for debugging
// -

import api from "./api"

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData)
    if (response.data.token) {

      localStorage.setItem("token", response.data.token)

      localStorage.setItem("userData", JSON.stringify(response.data.user))
    }
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : { message: error.message || "Server error" }
  }
}

export const login = async (userData) => {
  try {
    

    const response = await api.post("/auth/login", userData)


    if (response.data.token) {
      // Debug log

      localStorage.setItem("token", response.data.token)

      // Save user data for persistence
      localStorage.setItem("userData", JSON.stringify(response.data.user))
      window.dispatchEvent(new Event("authChange"))

      // Debug log for token
      const token = response.data.token
      try {
        const payload = parseToken(token)
      } catch (error) {
        console.error("Error parsing token:", error)
      }
    }
    return response.data
  } catch (error) {
    // Debug log
    console.error("auth.js - login - Login error:", error)

    throw error.response ? error.response.data : { message: error.message || "Server error" }
  }
}

export const logout = () => {

  localStorage.removeItem("token")
  localStorage.removeItem("userData")
  

  // window.location.href = "/"
}

// Get current user
export const getCurrentUser = async () => {
  if (!isAuthenticated()) {

    throw { message: "No authentication token found" }
  }

  try {

    const userData = localStorage.getItem("userData")
    if (userData) {
      console.log("auth.js - getCurrentUser - User data found in localStorage")

      return { user: JSON.parse(userData) }
    }

    const response = await api.get("/auth/user")


    localStorage.setItem("userData", JSON.stringify(response.data.user))

    return response.data
  } catch (error) {
    console.error("auth.js - getCurrentUser - Error:", error)

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token")
      localStorage.removeItem("userData")
    }
    throw error.response ? error.response.data : { message: error.message || "Server error" }
  }
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("token")


  if (!token) return false

  try {
    const payload = parseToken(token)


    const expiry = payload.exp * 1000 // Convert to milliseconds


    if (Date.now() >= expiry) {
      localStorage.removeItem("token")
      localStorage.removeItem("userData")
      return false
    }
    return true
  } catch (error) {
    // Debug log
    console.error("auth.js - isAuthenticated - Error parsing token:", error)

    // Invalid token
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    return false
  }
}

export const getUserRole = () => {
  const token = localStorage.getItem("token")


  if (!token) return null

  try {
    const payload = parseToken(token)


    return payload.role
  } catch (error) {
    console.error("auth.js - getUserRole - Error parsing token:", error)

    // If there's an error parsing the token, remove it as it might be corrupted
    localStorage.removeItem("token")
    localStorage.removeItem("userData")
    return null
  }
}

export const getUserId = () => {
  const userData = localStorage.getItem("userData")


  if (!userData) return null

  try {
    const user = JSON.parse(userData)


    return user.id
  } catch (error) {
    console.error("auth.js - getUserId - Error parsing user data:", error)

    return null
  }
}

const parseToken = (token) => {
  try {
    const base64Url = token.split(".")[1]
    if (!base64Url) throw new Error("Invalid token format")

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error parsing token:", error)
    throw error
  }
}