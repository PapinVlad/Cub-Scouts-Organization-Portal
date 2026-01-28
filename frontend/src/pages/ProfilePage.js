// Profile Page
//
// Core Functionality:
// - Displays authenticated user's profile information in a themed "Scout Dossier" format
// - Fetches user data from authentication system
// - Shows user badges through integrated UserBadges component
// - Provides role-specific content and navigation options
//
// Role-Based Content:
// - Leader: Shows admin controls and leadership responsibilities
// - Helper: Displays helper-specific features and scheduling options
// - Public Member: Presents general scout activities and exploration options
//
// Security & Authentication:
// - Restricts access to authenticated users only
// - Redirects unauthenticated users to login page
// - Handles authentication errors with user-friendly messages
//
// User Experience:
// - Implements themed loading message ("Unrolling your Scout Dossier...")
// - Provides clear error states with recovery options
// - Uses scout-themed terminology throughout the interface
// - Features decorative elements like pins and section headers
// - Includes scroll-to-top functionality for better navigation
//
// Uses Tailwind CSS with nature-themed color scheme (forest-green, woodland-brown).
// Client-side rendered with "use client" directive.
"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../utils/auth";
import UserBadges from "../components/UserBadges";
import ScrollToTopButton from "../components/ScrollToTopButton";
import {  Phone } from "lucide-react"

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      try {
        const { user } = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-beige">
        <div className="animate-pulse text-lg font-medium text-woodland-brown">
          Unrolling your Scout Dossier...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-beige p-4">
        <div className="bg-error bg-opacity-20 border border-error text-error px-4 py-3 rounded mb-4 w-full max-w-md">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-forest-green text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          Back to Scout Camp
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-beige p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 w-full max-w-md">
          <p>User not found. Please login again.</p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-forest-green text-white rounded-full hover:bg-primary-dark transition-colors"
        >
          Back to Scout Camp
        </button>
      </div>
    );
  }

  return (
    <section>
    <div className="min-h-screen bg-background-beige pt-20 pb-12 ">
      

      <div className="container mx-auto px-4  z-10">
        <h1 className="text-4xl font-heading font-bold text-woodland-brown mb-8 text-center drop-shadow-lg">
          User Profile: {user.firstName} {user.lastName}
        </h1>

        <div className="relative bg-white rounded-lg shadow-lg p-6 border border-forest-green mb-8">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-forest-green drop-shadow"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
            </svg>
          </div>

          <div className="bg-forest-green p-4 mb-4 flex flex-col sm:flex-row justify-between items-center rounded-t-lg">
            <h2 className="text-2xl font-heading font-bold text-white mb-2 sm:mb-0">
              User Details
            </h2>
            <span className="bg-woodland-brown text-white px-3 py-1 rounded-full text-sm font-medium">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-background-beige rounded-lg border border-woodland-brown">
              <span className="text-sm text-woodland-brown block mb-1">
                User Name
              </span>
              <span className="font-medium text-woodland-brown">
                {user.username}
              </span>
            </div>
            <div className="p-3 bg-background-beige rounded-lg border border-woodland-brown">
              <span className="text-sm text-woodland-brown block mb-1">
                Email Address
              </span>
              <span className="font-medium text-woodland-brown">
                {user.email}
              </span>
            </div>
            <div className="p-3 bg-background-beige rounded-lg border border-woodland-brown">
              <span className="text-sm text-woodland-brown block mb-1">
                Joined Troop
              </span>
              <span className="font-medium text-woodland-brown">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="p-3 bg-background-beige rounded-lg border border-woodland-brown">
              <span className="text-sm text-woodland-brown block mb-1">
                Last Camp Visit
              </span>
              <span className="font-medium text-woodland-brown">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* User Badges Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-forest-green mb-8">
          <UserBadges userId={user.id} isCurrentUser={true} />
        </div>

        {/* Role-specific content */}
        {user.role === "leader" && (
          <div className="relative bg-white rounded-lg shadow-lg p-6 border border-forest-green mb-8">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-forest-green drop-shadow"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
              </svg>
            </div>
            <div className="bg-forest-green p-4 mb-4 rounded-t-lg">
              <h3 className="text-xl font-heading font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
                Leader Camp
              </h3>
            </div>
            <div className="p-4">
              <p className="mb-4 text-woodland-brown">
                As a leader, you command the troop with:
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-woodland-brown">
                <li>Manage helpers and schedules</li>
                <li>Plan epic events</li>
                <li>Curate the photo gallery</li>
              </ul>
              <div className="flex flex-wrap gap-4">
                
                <button
                  onClick={() => navigate("/admin")}
                  className="px-4 py-2 bg-woodland-brown text-white rounded-full hover:bg-secondary-dark transition-colors"
                >
                  Admin Command
                </button>
              </div>
            </div>
          </div>
        )}

        {user.role === "helper" && (
          <div className="relative bg-white rounded-lg shadow-lg p-6 border border-forest-green mb-8">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-forest-green drop-shadow"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
              </svg>
            </div>
            <div className="bg-forest-green p-4 mb-4 rounded-t-lg">
              <h3 className="text-xl font-heading font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
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
                Helper Camp
              </h3>
            </div>
            <div className="p-4">
              <p className="mb-4 text-woodland-brown">
                As a helper, you support the troop with:
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-woodland-brown">
                <li>Check your helper schedule</li>
                <li>Update your availability</li>
                <li>Preview upcoming events</li>
                <li>Access training guides</li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/helper")}
                  className="px-4 py-2 bg-forest-green text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  Assist the Troop
                </button>
              </div>
            </div>
          </div>
        )}

        {user.role === "public" && (
          <div className="relative bg-white rounded-lg shadow-lg p-6 border border-forest-green mb-8">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-forest-green drop-shadow"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
              </svg>
            </div>
            <div className="bg-forest-green p-4 mb-4 rounded-t-lg">
              <h3 className="text-xl font-heading font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Scout Journey
              </h3>
            </div>
            <div className="p-4">
              <p className="mb-4 text-woodland-brown">
                As a member, explore the scout life with:
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-woodland-brown">
                <li>Discover badge challenges</li>
                <li>Browse the photo gallery</li>
                <li>Play scout games</li>
                <li>Learn about Cub Scouts</li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/badges")}
                  className="px-4 py-2 bg-forest-green text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  Start Your Quest
                </button>
                <button
                  onClick={() => navigate("/photos")}
                  className="px-4 py-2 bg-forest-green text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  Photo Gallery
                </button>
                <button
                  onClick={() => navigate("/games")}
                  className="px-4 py-2 bg-forest-green text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  Games
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="px-4 py-2 bg-forest-green text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  About Cub Scouts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <div className="fixed bottom-8 right-8 z-20">
        <a
          href="tel:+441234567890"
          className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 transform hover:scale-110"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
    <ScrollToTopButton />
    </section>
  );
};

export default ProfilePage;