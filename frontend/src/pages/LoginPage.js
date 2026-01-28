// Login and Registration Page
//
// Core Functionality:
// - Provides unified authentication interface with toggle between login and registration
// - Handles successful authentication with user data storage and redirection
// - Prevents authenticated users from accessing the page
// - Offers seamless navigation back to the home page
//
// State Management:
// - Tracks form display state (login vs registration)
// - Manages authentication success with localStorage and navigation
// - Checks existing authentication status on component mount
//
// User Experience:
// - Implements smooth transitions between login and registration forms
// - Features subtle hover animations and visual feedback
// - Uses consistent styling with the main site design
// - Provides clear navigation paths for different user states
//
// Visual Design:
// -
"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import LoginForm from "../components/LoginForm"
import RegisterForm from "../components/RegisterForm"
import { isAuthenticated } from "../utils/auth"

const LoginPage = () => {
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/")
    }
  }, [navigate])

  const handleLoginSuccess = (data) => {
    localStorage.setItem("userData", JSON.stringify(data.user))
    navigate("/")
  }

  const toggleForm = () => {
    setShowRegister(!showRegister)
  }

  return (
    <>
      

      <main className="min-h-screen bg-background-beige flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <section className="w-full max-w-md">
          <div className="mb-8">
            <Link
              to="/"
              className="flex items-center text-woodland-brown hover:text-forest-green transition-all duration-300 animate-slide-in"
            >
              <ArrowLeft className="h-5 w-5 mr-2 transform hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>

          <div className="form-card bg-background-beige rounded-2xl shadow-lg overflow-hidden border-2 border-forest-green animate-slide-in">
            <div className="bg-forest-green h-4 w-full"></div>
            <div className="p-8">
              {showRegister ? (
                <>
                  <RegisterForm onRegisterSuccess={handleLoginSuccess} />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-woodland-brown font-sans">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={toggleForm}
                        className="toggle-button font-medium text-forest-green focus:outline-none"
                      >
                        Login
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-woodland-brown font-sans">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={toggleForm}
                        className="toggle-button font-medium text-forest-green focus:outline-none"
                      >
                        Register
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default LoginPage