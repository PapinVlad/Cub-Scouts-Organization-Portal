// App Component
//
// Core Functionality:
// - Serves as the application's main entry point and routing controller
// - Manages authentication state and user session persistence
// - Implements role-based access control for protected routes
// - Organizes the application's overall layout structure
//
// Routing Architecture:
// - Configures public routes accessible to all visitors
// - Implements protected routes requiring authentication
// - Enforces role-based route restrictions (admin, leader, helper)
// - Handles redirects for unauthorized access attempts
//
// State Management:
// - Maintains current user information and authentication status
// - Tracks loading states during authentication processes
// - Manages error states for authentication failures
// - Persists user session across page refreshes
//
// Key Features:
// - ProtectedRoute component for access control enforcement
// - Automatic user data fetching on application initialization
// - Comprehensive error handling with user feedback
// - Consistent layout application with navigation and footer
//
// Security Implementation:
// - Verifies authentication status before rendering protected content
// - Validates user roles against allowed roles for specific routes
// - Redirects unauthorized access attempts to appropriate pages
// - Provides loading states during authentication verification

"use client"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { getCurrentUser, isAuthenticated, getUserRole } from "./utils/auth"

// Import pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import BadgesPage from "./pages/BadgesPage"
import EventsPage from "./pages/EventsPage"
import PhotosPage from "./pages/PhotosPage"
import AnnouncementsPage from "./pages/AnnouncementsPage"
import NotificationsPage from "./pages/NotificationsPage"
import NewsletterPage from "./pages/NewsletterPage"
import AdminDashboard from "./pages/AdminDashboard"
import UserManagement from "./pages/UserManagement"
import BadgeManagement from "./pages/BadgeManagement"
import CreateBadge from "./pages/CreateBadge"
import EditBadge from "./pages/EditBadge"
import BadgeAchievementPage from "./pages/BadgeAchievementPage"
import HelperPage from "./pages/HelperPage"
import HelperRegistrationPage from "./pages/HelperRegistrationPage"
import GamesPage from "./pages/GamesPage"
import PhotoUploadPage from "./pages/PhotoUploadPage"
import PhotoDetailPage from "./pages/PhotoDetailPage"
import HelperInfoPage from "./pages/HelperInfoPage"
import AboutPage from "./pages/AboutPage"
import ContactUsPage from "./pages/ContactUsPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage"
import NotFoundPage from "./pages/NotFoundPage"

/* import Header from "./components/Header" */
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import AnnouncementForm from "./components/announcements/AnnouncementForm"

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

  useEffect(() => {
    const fetchUser = async () => {

      if (isAuthenticated()) {
        try {
          const { user } = await getCurrentUser()
          console.log("App.js - fetchUser - User data fetched:", user)
          setUser(user)
        } catch (error) {
          console.error("Error fetching user:", error)
          setError("Failed to authenticate. Please login again.")
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const userRole = getUserRole()
    const isAuth = isAuthenticated()


    if (loading) {
      return <div>Loading...</div>
    }

    if (!isAuth) {
      console.log("ProtectedRoute - User is not authenticated, redirecting to login")
      return <Navigate to="/login" />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      console.log("ProtectedRoute - User role not allowed, redirecting to home")
      return <Navigate to="/" />
    }

    return children
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navigation user={user} />

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {<main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/helper-info" element={<HelperInfoPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />

            <Route path="/announcements" element={<AnnouncementsPage />} />

            
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            
            
           
            <Route path="/newsletter" element={<NewsletterPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

           
            <Route
              path="/helper"
              element={
                <ProtectedRoute allowedRoles={["helper", "leader"]}>
                  <HelperPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/helper/register"
              element={
                <ProtectedRoute>
                  <HelperRegistrationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/badges"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <BadgeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/badges/new"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <CreateBadge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/badges/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <EditBadge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/achievements"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <BadgeAchievementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements/create"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <AnnouncementForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <AnnouncementForm isEdit={true} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute allowedRoles={["admin", "leader"]}>
                  <AnnouncementsPage isAdmin={true} />
                </ProtectedRoute>
              }
            />
            <Route path="/photos/upload" element={<PhotoUploadPage />} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>}

        <Footer />
      </div>
    </Router>
  )
}

export default App
