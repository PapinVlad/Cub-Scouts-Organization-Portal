// Cub Scout Badges Page
//
// Core Functionality:
// - Displays public-facing badge catalog for Cub Scouts
// - Provides detailed view of individual badges on selection
// - Implements comprehensive filtering system (search, category, difficulty)
// - Fetches badge data and categories from API endpoints
// - Offers seamless navigation between list and detail views
//
// User Experience:
// - Presents badges in an engaging, visually appealing layout
// - Includes informative introduction to the badge system
// - Features call-to-action section for recruitment
// - Provides smooth transitions between views
//
// State Management:
// - Handles loading states with spinner animation
// - Manages error states with user-friendly messages
// - Maintains filter states for badge discovery
// - Tracks selected badge for detailed viewing
//
// Features:
// - Responsive design adapting to different screen sizes
// - Scroll animations for enhanced visual engagement
// - Gradient background creating visual depth
// - Comprehensive filtering options for badge discovery
// - Scroll-to-top button for improved navigation
//
// Uses Tailwind CSS with nature-themed color scheme (woodland-brown, forest-green).
// Client-side rendered with "use client" directive.
"use client";

import { useState, useEffect, use } from "react";
import api from "../utils/api";
import BadgeList from "../components/BadgeList";
import BadgeDetail from "../components/BadgeDetail";
import BadgeFilter from "../components/BadgeFilter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Link } from "react-router-dom"
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import {  Phone } from "lucide-react"

const BadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesResponse, categoriesResponse] = await Promise.all([
          api.get("/badges"),
          api.get("/badges/categories"),
        ]);

        setBadges(badgesResponse.data.badges || []);
        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.error("Error fetching badges:", error);
        setError("Failed to load badges. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBadgeSelect = async (badgeId) => {
    try {
      setLoading(true);
      const response = await api.get(`/badges/${badgeId}`);
      setSelectedBadge(response.data.badge);
    } catch (error) {
      console.error("Error fetching badge details:", error);
      setError("Failed to load badge details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedBadge(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const filteredBadges = badges.filter((badge) => {
   const matchesSearch = (badge.name || "").toLowerCase().startsWith(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || badge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "" || badge.difficultyLevel.toString() === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  useScrollAnimation(loading);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-heading font-bold text-woodland-brown mb-6 drop-shadow-lg">Cub Scout Badges</h1>
        <div className="bg-red-100 text-red-700 p-6 rounded-xl shadow-2xl">{error}</div>
      </div>
    );
  }

  return (
    <>
    <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background-beige to-white min-h-screen">
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-background-beige to-white min-h-screen">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-woodland-brown mb-8 text-center drop-shadow-xl">
        Cub Scout Badges
      </h1>

      {selectedBadge ? (
        <BadgeDetail badge={selectedBadge} onBack={handleBackToList} />
      ) : (
        <>
          <p className="text-center text-text-secondary mb-12 max-w-4xl mx-auto text-lg drop-shadow">
            Dive into the world of badges that Cub Scouts can earn! Each badge is a badge of honor, showcasing skills and
            knowledge across diverse adventures. Click a badge to uncover its secrets and challenges.
          </p>

          <BadgeFilter
            categories={categories}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryFilter}
            onDifficultyChange={handleDifficultyFilter}
          />

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-forest-green"></div>
            </div>
          ) : (
            <BadgeList badges={filteredBadges} onBadgeSelect={handleBadgeSelect} />
          )}
        </>
      )}
      <div className="fixed bottom-8 right-8 z-20">
        <a
          href="tel:+441234567890"
          className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 transform hover:scale-110"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>
      
      <ScrollToTopButton />
      {/* Call to Action Section */}
            
    </div>
    
    </section>
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
    </>
  );
};

export default BadgesPage;