// Announcements Page Component
//
// Core Functionality:
// - Displays announcements in a bulletin board style with visual "pinned notes" effect
// - Fetches announcements from API with role-based visibility filtering
// - Provides category filtering (events, badges, training, general)
// - Sorts announcements with pinned items prioritized
//
// User Permissions:
// - Adapts UI based on authentication status and user role
// - Shows admin controls (edit/delete) only for admins and leaders
// - Filters announcements based on user role and target audience
//
// State Management:
// - Handles loading states with animation
// - Manages error states with user-friendly messages
// - Maintains filtered and sorted announcement lists
//
// Features:
// - Responsive grid layout for different screen sizes
// - Visual styling with tilted notes and colored pins
// - Confirmation dialogs for destructive actions
// - Call-to-action section for recruitment
//
// Uses Tailwind CSS with custom color scheme (forest-green, woodland-brown).
// Client-side rendered with "use client" directive.
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";
import api from "../utils/api";
import ScrollToTopButton from "../components/ScrollToTopButton";
import {  Phone } from "lucide-react"

const AnnouncementsPage = ({ isAdmin = false }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const isAuth = isAuthenticated();
  const userRole = getUserRole();
  const canCreateAnnouncement = isAuth && (userRole === "admin" || userRole === "leader");

  useEffect(() => {
    fetchAnnouncements();
  }, [isAdmin]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isAdmin ? "/announcements/admin/all" : "/announcements";

      const response = await api.get(endpoint);

      if (response.data && response.data.success) {
        setAnnouncements(response.data.announcements || []);
      } else {
        setError("Failed to load announcements. Please try again later.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError(`Failed to load announcements: ${error.message || "Unknown error"}`);
      setLoading(false);
      setAnnouncements([]);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Are you sure you want to remove this note from the board?")) {
      return;
    }

    try {
      const response = await api.delete(`/announcements/${announcementId}`);

      if (response.data && response.data.success) {
        setAnnouncements(announcements.filter((a) => a.announcement_id !== announcementId));
      } else {
        alert("Failed to remove the announcement. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to remove the announcement. Please try again later.");
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!isAuth && announcement.target_role !== "all") {
      return false;
    }
    if (isAuth && announcement.target_role !== "all" && announcement.target_role !== userRole) {
      return false;
    }
    if (filter !== "all" && announcement.category !== filter) {
      return false;
    }
    return true;
  });

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const getNoteStyle = (index) => {
    const tilt = (index % 2 === 0 ? -2 : 2) + (Math.random() * 2 - 1);
    return {
      transform: `rotate(${tilt}deg)`,
      transition: "transform 0.3s ease",
    };
  };

  const getPinColor = (announcement) => {
    if (announcement.is_pinned) return "text-yellow-400";
    switch (announcement.category) {
      case "events": return "text-forest-green";
      case "badges": return "text-woodland-brown";
      case "training": return "text-primary-dark";
      case "general": return "text-orange-500";
      default: return "text-red-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-beige">
        <div className="animate-pulse text-lg font-medium text-woodland-brown">
          Unrolling the Scout Bulletin...
        </div>
      </div>
    );
  }
  console.log("Announcements:", sortedAnnouncements);

  return (
    <div className="min-h-screen bg-background-beige pt-20 pb-12 relative bulletin-board">
      {/* Bulletin Board Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0 "></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-woodland-brown mb-4 md:mb-0 drop-shadow-lg">
            Scout Bulletin Board
          </h1>
          {canCreateAnnouncement && (
            <Link
              to="/admin/announcements/create"
              className="btn bg-forest-green hover:bg-primary-dark text-white px-6 py-3 rounded-full transition-colors duration-200 flex items-center animate-pulse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Pin a New Note
            </Link>
          )}
        </div>

        {error && (
          <div className="bg-error bg-opacity-20 border border-error text-error px-4 py-3 rounded mb-8 text-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center bg-white rounded-lg shadow-md p-4">
            <label htmlFor="filter" className="font-medium text-woodland-brown mr-3">
              Filter Notices:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select px-3 py-2 border border-forest-green rounded-full text-woodland-brown focus:outline-none focus:ring-2 focus:ring-forest-green"
            >
              <option value="all">All Notices</option>
              <option value="events">Events</option>
              <option value="badges">Badges</option>
              <option value="training">Training</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Announcements as Pinned Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAnnouncements.length === 0 ? (
            <div className="col-span-full bg-white p-8 text-center rounded-lg border border-woodland-brown shadow-md">
              <p className="text-woodland-brown font-medium">No notices on the board yet. Check back soon!</p>
            </div>
          ) : (
            sortedAnnouncements.map((announcement, index) => (
              <div
                key={announcement.announcement_id || announcement.id}
                className="relative bg-white rounded-lg shadow-lg p-6 border border-forest-green note-tilt hover:shadow-xl"
                style={getNoteStyle(index)}
              >
                {/* Pin Icon */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${getPinColor(announcement)} drop-shadow`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
                  </svg>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <h2 className="text-xl font-heading font-bold text-woodland-brown flex items-center">
                    {announcement.is_pinned && (
                      <span className="text-yellow-500 mr-2" title="Pinned announcement">
                        📌
                      </span>
                    )}
                    {announcement.title}
                  </h2>
                  <span className="text-sm text-forest-green mt-1 sm:mt-0">
                    {new Date(announcement.created_at || announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-woodland-brown mb-4">
                  {announcement.content.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-forest-green text-sm text-forest-green">
                  <span className="mb-1 sm:mb-0">
                    Category: <span className="font-medium">{announcement.category || "General"}</span>
                  </span>
                  <span>
                    Posted by:{" "}
                    <span className="font-medium">
                      {announcement.creator_name || announcement.createdBy?.name || "Scout Leader"}
                    </span>
                  </span>
                </div>

                {canCreateAnnouncement && (
                  <div className="flex justify-end mt-4 space-x-2">
                    <Link
                      to={`/admin/announcements/edit/${announcement.announcement_id || announcement.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-forest-green text-sm font-medium rounded-full text-forest-green bg-white hover:bg-forest-green hover:text-white transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Note
                    </Link>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.announcement_id || announcement.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full text-white bg-error hover:bg-error-dark transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove Note
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Call to Action */}
        
        
      </div>
       {/* Call to Action Section */}
            <section className="py-16 bg-forest-green text-white text-center animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-heading font-bold mb-6">Be Part of Our Story</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Whether you’re a cub ready for adventure, a parent wanting to help, or a leader eager to inspire, Obanshire Cub Scouts welcomes you.
                </p>
                <Link
                  to="/login"
                  className="btn bg-white text-woodland-brown hover:bg-forest-green hover:text-white border-2 border-white px-6 py-3 rounded-md inline-block transition-colors duration-200"
                >
                  Join Our Pack Today
                </Link>
              </div>
            </section>
            <div className="fixed bottom-8 right-8 z-20">
        <a
          href="tel:+441234567890"
          className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 transform hover:scale-110"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default AnnouncementsPage;