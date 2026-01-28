// Photos Gallery Page
//
// Core Functionality:
// - Serves as the main photo gallery hub for the Cub Scouts website
// - Displays photos with filtering, sorting, and search capabilities
// - Adapts display based on authentication status and URL parameters
// - Integrates with PhotoGallery component for actual photo rendering
//
// User Interface:
// - Features engaging hero section with animated background
// - Provides intuitive search and filter controls
// - Offers direct navigation to photo upload for authenticated users
// - Implements responsive layout for various screen sizes
// - Includes call-to-action section for recruitment
//
// Data Management:
// - Handles URL query parameters for event-specific filtering
// - Maintains filter and search state for gallery customization
// - Passes filter parameters to child PhotoGallery component
// - Adapts available options based on authentication status
//
// User Experience:
// - Implements smooth animations for content reveal
// - Provides visual feedback through hover effects and transitions
// - Features decorative wave divider between sections
// - Includes scroll-to-top functionality for better navigation
//
// Uses Tailwind CSS with nature-themed color scheme and custom animations.
// Client-side rendered component.
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import PhotoGallery from "../components/PhotoGallery";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollToTopButton from "../components/ScrollToTopButton";
import {  Phone } from "lucide-react"


const PhotosPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const isLoggedIn = isAuthenticated();

  useScrollAnimation(false);

  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("event");

  let pageTitle = "Photo Gallery";
  if (eventId) {
    pageTitle = "Event Photos";
  }

  return (
    <div className="bg-background-beige min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-forest-green to-scout-green-dark animate-slideIn">
        <div className="absolute inset-0">
          <img
            src="../assets/ezgif.com-speed.gif"
            alt="Obanshire Cub Scouts Photo Gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-accent font-bold mb-6 drop-shadow-lg">
            Capture the Scout Spirit
          </h1>
          <p className="text-xl md:text-2xl font-sans mb-8 max-w-3xl mx-auto drop-shadow">
            Dive into our gallery of unforgettable moments from hikes, campfires, and team adventures. Share your own scout story!
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#gallery"
              className="btn bg-gradient-to-r from-forest-green to-scout-green-dark hover:from-primary-dark hover:to-scout-green text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
              aria-label="Explore Gallery"
            >
              Explore Gallery
            </a>
            {isLoggedIn && (
              <Link
                to="/photos/upload"
                className="btn bg-gradient-to-r from-forest-green to-scout-green-dark hover:from-primary-dark hover:to-scout-green text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
                aria-label="Share Your Moment"
              >
                Share Your Moment
              </Link>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 100L60 80C120 60 240 20 360 20C480 20 600 60 720 80C840 100 960 100 1080 80C1200 60 1320 20 1380 0L1440 0V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z"
              fill="#F5F5DC"
            />
          </svg>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="py-16 bg-background-beige bg-background-beige bg-blend-overlay animate-slideInUp">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 border-2 border-forest-green max-w-3xl mx-auto">
            <h2 className="text-2xl font-accent font-bold text-woodland-brown mb-6">Find Your Adventure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-forest-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-12l4 4-4 4-4-4 4-4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by title or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full border-2 border-forest-green rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-scout-green-dark transition-all duration-300"
                />
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-woodland-brown font-medium text-lg">Sort By:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="flex-grow border-2 border-forest-green rounded-lg py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-scout-green-dark transition-all duration-300"
                >
                  <option value="all">All Photos</option>
                  <option value="recent">Recent</option>
                  <option value="popular">Popular</option>
                  {isLoggedIn && <option value="my">My Uploads</option>}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-16 bg-white bg-background-beige bg-bottom bg-no-repeat animate-slideIn">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-accent font-bold text-woodland-brown mb-8 text-center">{pageTitle}</h2>
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-forest-green">
            {eventId ? (
              <PhotoGallery eventId={eventId} searchTerm={searchTerm} filter={filter} />
            ) : (
              <PhotoGallery isPublic={!isLoggedIn} searchTerm={searchTerm} filter={filter} />
            )}
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
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

export default PhotosPage;