// Navigation Component
//
// Core Functionality:
// - Provides the main navigation interface for the Obanshire Cub Scouts website
// - Implements responsive design with distinct desktop and mobile layouts
// - Manages authentication-aware navigation with dynamic menu options
// - Enforces role-based access control for navigation items
//
// Navigation Features:
// - Responsive desktop navigation with horizontal menu items
// - Mobile-friendly slide-in navigation panel with toggle functionality
// - Dropdown menus for grouped functionality (Admin, Communication)
// - Active link highlighting based on current route
// - Notification counter for unread items
// - User profile access with personalized greeting
// - Authentication state management (login/logout)
//
// State Management:
// - Tracks authentication status and user role for conditional rendering
// - Manages dropdown and mobile menu open/closed states
// - Synchronizes with authentication changes via event listeners
// - Maintains unread notification count
// - Handles outside clicks for dropdown menu dismissal
//
// User Experience:
// - Provides visual feedback for active navigation items
// - Implements smooth transitions for mobile menu and dropdowns
// - Displays user's first name for personalized experience
// - Uses consistent iconography for improved recognition
// - Maintains navigation context across authentication changes
//
// Security Implementation:
// - Conditionally renders admin options based on user role
// - Restricts helper dashboard access to appropriate roles
// - Handles authentication state changes gracefully
// - Provides secure logout functionality

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { isAuthenticated, getUserRole, logout, getCurrentUser } from "../utils/auth"

const Navigation = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser)
  const [isAuth, setIsAuth] = useState(isAuthenticated())
  const [userRole, setUserRole] = useState(getUserRole())
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = isAuthenticated()
      setIsAuth(authenticated)

      if (authenticated) {
        const role = getUserRole()
        setUserRole(role)

        if (!propUser) {
          try {
            const userData = localStorage.getItem("userData")
            if (userData) {
              setUser(JSON.parse(userData))
            } else {
              const { user } = await getCurrentUser()
              setUser(user)
            }
          } catch (error) {
            console.error("Error fetching user in Navigation:", error)
          }
        } else {
          setUser(propUser)
        }
      } else {
        setUser(null)
        setUserRole(null)
      }
    }

    checkAuth()

    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener("authChange", handleAuthChange)

    const handleLocationChange = () => {
      setMoreMenuOpen(false)
    }

    window.addEventListener("popstate", handleLocationChange)

    return () => {
      window.removeEventListener("authChange", handleAuthChange)
      window.removeEventListener("popstate", handleLocationChange)
    }
  }, [propUser, location])

  useEffect(() => {
    if (isAuth) {
      setUnreadCount(3) 
    }
  }, [isAuth])

  const handleLogout = () => {
    logout()
    setIsAuth(false)
    setUser(null)
    setUserRole(null)
    navigate("/")
    window.dispatchEvent(new Event("authChange"))
  }

  const isAdmin = userRole === "admin" || userRole === "leader"
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleMoreMenu = () => {
    setMoreMenuOpen(!moreMenuOpen)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      const moreButton = document.querySelector("button[onClick^='toggleMoreMenu']")
      const moreMenu = document.querySelector(".absolute.right-0.mt-2.w-48")
      if (
        moreMenuOpen &&
        moreButton &&
        !moreButton.contains(event.target) &&
        moreMenu &&
        !moreMenu.contains(event.target)
      ) {
        setMoreMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [moreMenuOpen])

  return (
    <nav className="bg-gradient-to-r from-woodland-brown to-secondary-dark text-white shadow-lg font-raleway ">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/assets/Logo.svg" alt="Obanshire Cub Scouts Logo" className="h-10 w-10 mr-2" />
              <span className="font-heading font-bold text-xl hidden md:block">Obanshire Cub Scouts</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-full text-white bg-forest-green hover:bg-opacity-80 transition-all duration-300"
            >
              <svg
                className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              Home
            </Link>
            <Link
              to="/about"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/about") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              About Us
            </Link>
            <Link
              to="/badges"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/badges") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V6h2v6z" />
              </svg>
              Badges
            </Link>
            <Link
              to="/photos"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/photos") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              Photos
            </Link>
            <Link
              to="/games"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/games") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 4h2v2h-2V8zm0 4h2v2h-2v-2zm-4 0h2v2H8v-2zm0-4h2v2H8V8zm4 8h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h-2v2h2v-2z" />
              </svg>
              Games
            </Link>
            <Link
              to="/events"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/events") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
              </svg>
              Events
            </Link>
            <Link
              to="/announcements"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/announcements") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
              </svg>
              Announcements
            </Link>
            <Link
              to="/contact"
              className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/contact") ? "text-forest-green" : ""}`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
              </svg>
              Contact Us
            </Link>

            {isAuth && (
              <>
                {/* More Menu for additional items */}
                <div className="relative">
                  <button
                    onClick={toggleMoreMenu}
                    className="nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                    More
                  </button>
                  {moreMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-text-primary z-60">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown("communication")}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-dark"
                        >
                          Communication
                        </button>
                        {activeDropdown === "communication" && (
                          <div className="pl-4 space-y-1">
                            <Link
                              to="/notifications"
                              className="block px-4 py-2 text-sm hover:bg-background-dark relative"
                              onClick={() => setMoreMenuOpen(false)}
                            >
                              Notifications
                              
                            </Link>
                            <Link
                              to="/newsletter"
                              className="block px-4 py-2 text-sm hover:bg-background-dark"
                              onClick={() => setMoreMenuOpen(false)}
                            >
                              Newsletter
                            </Link>
                          </div>
                        )}
                      </div>

                      {(userRole === "helper" ) && (
                        <Link
                          to="/helper"
                          className="block px-4 py-2 text-sm text-text-primary hover:bg-background-dark"
                          onClick={() => setMoreMenuOpen(false)}
                        >
                          Helper Dashboard
                        </Link>
                      )}

                      {isAdmin && (
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown("admin")}
                            className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-background-dark"
                          >
                            Admin
                          </button>
                          {activeDropdown === "admin" && (
                            <div className="pl-4 space-y-1">
                              <Link
                                to="/admin"
                                className="block px-4 py-2 text-sm hover:bg-background-dark"
                                onClick={() => setMoreMenuOpen(false)}
                              >
                                Dashboard
                              </Link>
                              <Link
                                to="/admin/badges"
                                className="block px-4 py-2 text-sm hover:bg-background-dark"
                                onClick={() => setMoreMenuOpen(false)}
                              >
                                Manage Badges
                              </Link>
                              <Link
                                to="/admin/achievements"
                                className="block px-4 py-2 text-sm hover:bg-background-dark"
                                onClick={() => setMoreMenuOpen(false)}
                              >
                                Badge Achievements
                              </Link>
                              <Link
                                to="/admin/users"
                                className="block px-4 py-2 text-sm hover:bg-background-dark"
                                onClick={() => setMoreMenuOpen(false)}
                              >
                                Manage Users
                              </Link>
                              <Link
                                to="/admin/announcements"
                                className="block px-4 py-2 text-sm hover:bg-background-dark"
                                onClick={() => setMoreMenuOpen(false)}
                              >
                                Advertisement management
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to="/profile"
                  className={`nav-item relative px-2 py-2 text-sm font-medium text-white hover:text-white ${isActive("/profile") ? "text-forest-green" : ""} flex items-center`}
                >
                  <svg
                    className="w-4 h-4 inline mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  My Profile {user && `(${user.firstName})`}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-2 py-2 rounded-full text-sm font-medium bg-error text-white hover:bg-red-700 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuth && (
              <Link
                to="/login"
                className="px-2 py-2 rounded-full text-sm font-medium bg-forest-green text-white hover:bg-opacity-80 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-secondary-dark text-white transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden transition-transform duration-300 ease-in-out z-50 overflow-y-auto max-h-screen`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-forest-green transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-2 space-y-2">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Home
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/about") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            About Us
          </Link>
          <Link
            to="/badges"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/badges") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V6h2v6z" />
            </svg>
            Badges
          </Link>
          <Link
            to="/photos"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/photos") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            Photos
          </Link>
          <Link
            to="/games"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/games") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 4h2v2h-2V8zm0 4h2v2h-2v-2zm-4 0h2v2H8v-2zm0-4h2v2H8V8zm4 8h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h-2v2h2v-2z" />
            </svg>
            Games
          </Link>
          <Link
            to="/events"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/events") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
            Events
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/contact") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
            Contact
          </Link>
          <Link
            to="/announcements"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/announcements") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
            onClick={toggleMobileMenu}
          >
            <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
            Announcements
          </Link>

          {isAuth && (
            <>
              <div className="border-t border-gray-700 pt-2">
                <button
                  onClick={() => toggleDropdown("communication")}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                >
                  <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                  </svg>
                  Communication
                </button>
                {activeDropdown === "communication" && (
                  <div className="pl-6 space-y-1">
                    <Link
                      to="/notifications"
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white relative"
                      onClick={() => {
                        toggleMobileMenu()
                        setMoreMenuOpen(false)
                      }}
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <span className="absolute right-4 top-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-error rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/newsletter"
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                      onClick={() => {
                        toggleMobileMenu()
                        setMoreMenuOpen(false)
                      }}
                    >
                      Newsletter
                    </Link>
                  </div>
                )}
              </div>

              {(userRole === "helper" || userRole === "leader") && (
                <Link
                  to="/helper"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/helper") ? "bg-forest-green text-white" : "text-white hover:bg-forest-green hover:text-white"} transition-all duration-300`}
                  onClick={() => {
                    toggleMobileMenu()
                    setMoreMenuOpen(false)
                  }}
                >
                  <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V6h2v6zm4 4h-2v-2h2v2zm0-4h-2V6h2v6z" />
                  </svg>
                  Helper Dashboard
                </Link>
              )}

              {isAdmin && (
                <div className="border-t border-gray-700 pt-2">
                  <button
                    onClick={() => toggleDropdown("admin")}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                  >
                    <svg className="w-5 h-5 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V6h2v6zm4 4h-2v-2h2v2zm0-4h-2V6h2v6z" />
                    </svg>
                    Admin
                  </button>
                  {activeDropdown === "admin" && (
                    <div className="pl-6 space-y-1">
                      <Link
                        to="/admin"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                        onClick={() => {
                          toggleMobileMenu()
                          setMoreMenuOpen(false)
                        }}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/badges"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                        onClick={() => {
                          toggleMobileMenu()
                          setMoreMenuOpen(false)
                        }}
                      >
                        Manage Badges
                      </Link>
                      <Link
                        to="/admin/achievements"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                        onClick={() => {
                          toggleMobileMenu()
                          setMoreMenuOpen(false)
                        }}
                      >
                        Badge Achievements
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                        onClick={() => {
                          toggleMobileMenu()
                          setMoreMenuOpen(false)
                        }}
                      >
                        Manage Users
                      </Link>
                      <Link
                        to="/admin/announcements"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white transition-all duration-300"
                        onClick={() => {
                          toggleMobileMenu()
                          setMoreMenuOpen(false)
                        }}
                      >
                        Advertisement management
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="border-t border-gray-700 pt-2">
            {!isAuth ? (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-forest-green text-white hover:bg-opacity-80 transition-all duration-300"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-forest-green hover:text-white flex items-center transition-all duration-300"
                  onClick={() => {
                    toggleMobileMenu()
                    setMoreMenuOpen(false)
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  My Profile {user && `(${user.firstName})`}
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-error text-white hover:bg-red-700 mt-2 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation