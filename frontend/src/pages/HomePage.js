// Home Page
//
// Core Functionality:
// - Serves as the main landing page for the Cub Scouts organization
// - Fetches and displays upcoming events, badges, and photos from API
// - Provides navigation to key sections of the website
// - Showcases the organization's offerings and values
//
// Content Sections:
// - Hero section with animated background and call-to-action buttons
// - Organization introduction with mission statement
// - Program offerings with visual representations
// - Upcoming events with interactive expandable cards
// - Photo gallery showcasing recent activities
// - Badge showcase highlighting achievement opportunities
// - Volunteer recruitment section with benefits list
//
// Data Integration:
// - Fetches data from multiple API endpoints (events, badges, photos)
// - Filters events to show only upcoming ones
// - Formats dates and times for user-friendly display
// - Handles image paths with fallback options
//
// User Experience:
// - Implements staggered animations for content reveal
// - Features interactive elements with hover effects
// - Provides expandable event cards for additional information
// - Uses consistent visual language and navigation patterns
// - Includes scroll-to-top functionality for better navigation
//
// Uses Tailwind CSS with nature-themed color scheme and custom animations.
// Client-side rendered with "use client" directive.
"use client";

import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../utils/api";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollToTopButton from "../components/ScrollToTopButton";
import {  Phone } from "lucide-react"

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [badges, setBadges] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const sectionRef = useRef(null);

  useScrollAnimation(loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, badgesResponse, photosResponse] = await Promise.all([
          api.get("/events"),
          api.get("/badges"),
          api.get("/photos"),
        ]);

        const eventsData = eventsResponse.data.data || eventsResponse.data.events || [];
        const mappedEvents = eventsData.map(event => ({
          ...event,
          location: event.locationAddress ? `${event.locationName}, ${event.locationAddress}` : event.locationName || "Location TBD",
          date: event.startDate || event.start_date || "TBD",
          startTime: event.startTime || event.start_time || "",
          endTime: event.endTime || event.end_time || "",
          description: event.description || "No description available", // Добавлена проверка описания
        }));
        setEvents(mappedEvents);

        const badgesData = badgesResponse.data.data || badgesResponse.data.badges || [];
        setBadges(badgesData);

        const photosData = photosResponse.data.data || photosResponse.data.photos || [];
        setPhotos(photosData);
      } catch (error) {
        console.error("Error fetching home page data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setExpandedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderDifficulty = (level) => {
    return Array(level)
      .fill()
      .map((_, i) => (
        <svg key={i} className="w-4 h-4 text-forest-green" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return !isNaN(date) ? date.toLocaleDateString(undefined, options) : "TBD";
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  if (error) {
    return (
      <div className="bg-background-beige min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background-beige min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const displayedEvents = filteredEvents.slice(0, 3);

  return (
    <div className="bg-background-beige min-h-screen">
      <section className="relative bg-woodland-brown overflow-hidden animate-on-scroll opacity-0 transition-all duration-700 translate-y-8 text-white" >
        <div className="absolute inset-0">
          <img
            src="/assets/ezgif.com-speed.gif"
            alt="Obanshire Cub Scouts Adventure Animation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 drop-shadow-lg ">
            Welcome to Obanshire Cub Scouts
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow">
            Join us for exciting local adventures, badge-earning challenges, and a community rooted in teamwork, courage,
            and nature.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="btn bg-forest-green hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-md transition-colors duration-200"
            >
              Join Us
            </Link>
            <Link
              to="/events"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-woodland-brown px-6 py-3 rounded-md transition-colors duration-200"
            >
              Explore Events
            </Link>
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

      <section className="py-16 bg-white animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="lg:w-1/2 relative group">
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
            <img 
              src="/assets/scout.png" 
              alt="Obanshire Cub Scouts Group" 
              className="w-full h-auto transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-tr from-forest-green/10 via-transparent to-sage-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-forest-green/30 rounded-tl-lg transition-all duration-300 group-hover:border-forest-green/60"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-sage-green/30 rounded-br-lg transition-all duration-300 group-hover:border-sage-green/60"></div>
          </div>
          
          <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-4 shadow-xl border-4 border-forest-green/20 group-hover:border-forest-green/40 transition-all duration-300 group-hover:scale-110">
            <div className="w-12 h-12 bg-gradient-to-br from-forest-green to-sage-green rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">🏕️</span>
            </div>
          </div>
        </div>
      </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-heading font-bold mb-4 text-woodland-brown">Who We Are</h2>
              <p className="mb-4 text-text-primary">
                Obanshire Cub Scouts is a local branch of the national Scout organization, offering children aged 8-10
                the opportunity to develop new skills, make friends, and participate in exciting adventures. Our program
                combines outdoor learning, teamwork, and personal development in a safe and supportive environment.
              </p>
              <p className="mb-6 text-text-primary">
                We believe in learning by doing, and our activities are designed to be both educational and fun. From
                camping and hiking to crafts and community service, we provide a wide range of experiences that help
                young people grow in confidence and capability.
              </p>
              <Link
                to="/about"
                className="btn bg-forest-green hover:bg-primary-dark text-white px-6 py-3 rounded-md inline-block transition-colors duration-200"
              >
                About Our Pack
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-woodland-brown">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:bg-primary-light hover:shadow-2xl group">
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/outdoor-adventures.png"
                  alt="Outdoor Adventures"
                  className="h-20 w-20 rounded-full border-2 border-forest-green object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-center mb-2 text-woodland-brown transition-colors duration-300">
                Outdoor Adventures
              </h3>
              <p className="text-center text-text-primary">
                Hikes, camps, and outdoor activities that develop a love for nature and survival skills.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:bg-primary-light hover:shadow-2xl group">
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/badges-achievements.png"
                  alt="Badges and Achievements"
                  className="h-20 w-20 rounded-full border-2 border-forest-green object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-center mb-2 text-woodland-brown transition-colors duration-300">
                Badges & Achievements
              </h3>
              <p className="text-center text-text-primary">
                Opportunities to earn over 30 different badges, developing new skills and knowledge.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:bg-primary-light hover:shadow-2xl group">
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/teambuilding.png"
                  alt="Teamwork"
                  className="h-20 w-20 rounded-full border-2 border-forest-green object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-center mb-2 text-woodland-brown transition-colors duration-300">
                Teamwork
              </h3>
              <p className="text-center text-text-primary">
                Development of cooperation, leadership, and friendship through group activities and projects.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:bg-primary-light hover:shadow-2xl group">
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/creativity-games.png"
                  alt="Creativity and Games"
                  className="h-20 w-20 rounded-full border-2 border-forest-green object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-center mb-2 text-woodland-brown transition-colors duration-300">
                Creativity & Games
              </h3>
              <p className="text-center text-text-primary">
                Creative activities, games, and entertainment that make learning fun and engaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23f5f5dc\'/%3E%3Cpath d=\'M10 10 L90 10 L90 90 L10 90 Z\' fill=\'none\' stroke=\'%238b5a2b\' stroke-width=\'2\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'2\' fill=\'%238b5a2b\'/%3E%3Ccircle cx=\'80\' cy=\'80\' r=\'2\' fill=\'%238b5a2b\'/%3E%3C/svg%3E')] bg-repeat bg-[length:200px_200px] animate-on-scroll opacity-0 transition-all duration-700 translate-y-8 relative" ref={sectionRef}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-woodland-brown mb-4 md:mb-0">Upcoming Events</h2>
            <Link to="/events" className="text-autumn-brown hover:text-secondary-light font-medium">
              View All Events →
            </Link>
          </div>

          {displayedEvents.length === 0 ? (
            <div className="text-center text-text-primary py-12">No upcoming events available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedEvents.map((event, index) => {
                const eventDate = new Date(event.startDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                eventDate.setHours(0, 0, 0, 0);
                const isToday = eventDate.toDateString() === today.toDateString();
                const formattedDate = isToday ? "Today" : formatDate(event.startDate);

                return (
                  <div
                    key={event.id}
                    className={`relative bg-white/90 rounded-lg shadow-md p-4 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forest-green ${
                      expandedIndex === index ? "shadow-lg border-2 border-forest-green bg-forest-green/10" : "shadow-md border border-woodland-brown/20"
                    }`}
                    onClick={() => {
                      console.log(`Clicked index: ${index}, expandedIndex: ${expandedIndex}`);
                      setExpandedIndex(expandedIndex === index ? null : index);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedIndex(expandedIndex === index ? null : index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="absolute -top-3 -left-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-woodland-brown"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <div className="mb-2">
                      <h3 className="text-lg font-heading font-bold text-woodland-brown">{event.title || "Untitled"}</h3>
                      <p className="text-sm text-text-secondary">{formattedDate}</p>
                    </div>

                    <div
                      className={`overflow-hidden transition-max-h duration-300 ease-in-out ${
                        expandedIndex === index ? "max-h-72" : "max-h-0"
                      }`}
                    >
                      <div className="pt-2">
                        <p className="text-sm text-text-secondary">{event.location || "Location TBD"}</p>
                        {event.startTime && (
                          <div className="flex items-center mt-1 text-sm text-text-secondary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
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
                            {formatTime(event.startTime)}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </div>
                        )}
                        <p className="mt-2 text-text-primary line-clamp-4">
                          {event.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-background-beige animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-woodland-brown">Our Adventures in Photos</h2>
            <Link to="/photos" className="text-autumn-brown hover:text-secondary-light font-medium">
              View All Photos →
            </Link>
          </div>

          {photos.length === 0 ? (
            <div className="text-center text-text-primary py-12">No photos available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((photo) => (
                <div key={photo.id || photo.photo_id} className="relative group overflow-hidden rounded-lg shadow-md">
                  <img
                    src={getImageUrl(photo.image || photo.thumbnail_url || photo.image_url || "/placeholder.svg")}
                    alt={photo.title || "Photo"}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      console.error(`Error loading image: ${e.target.src}`);
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-woodland-brown/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-white font-medium">{photo.title || "Untitled"}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white animate-on-scroll opacity-0 transition-all duration-700 translate-y-8 relative overflow-hidden">
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-10 w-2 h-2 bg-forest-green rounded-full animate-float"></div>
    <div className="absolute top-32 right-16 w-1 h-1 bg-autumn-brown rounded-full animate-float-delayed"></div>
    <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-secondary-light rounded-full animate-float-slow"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-heading font-bold text-woodland-brown relative group">
        Explore Our Badges
        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-forest-green to-autumn-brown transition-all duration-500 group-hover:w-full"></span>
      </h2>
      <Link 
        to="/badges" 
        className="text-autumn-brown hover:text-secondary-light font-medium relative group transition-all duration-300 hover:scale-105"
      >
        View All Badges
        <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-light transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </div>

    {badges.length === 0 ? (
      <div className="text-center text-text-primary py-12">No badges available.</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {badges.slice(0, 4).map((badge, index) => (
          <div
            key={badge.id}
            className="group relative bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-3 hover:rotate-1 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-forest-green/5 via-transparent to-autumn-brown/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
              <div className="w-2 h-2 bg-secondary-light rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300">
              <div className="w-1 h-1 bg-forest-green rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-6 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-400">
              <div className="w-1.5 h-1.5 bg-autumn-brown rounded-full animate-pulse"></div>
            </div>

            <div className="flex justify-center mb-4 relative">
              <div className="relative group/image">
                <div className="absolute inset-0 rounded-full border-2 border-forest-green/20 group-hover:border-forest-green/60 transition-all duration-500 group-hover:animate-spin-slow"></div>
                <div className="absolute inset-0 rounded-full border-2 border-autumn-brown/20 group-hover:border-autumn-brown/60 transition-all duration-500 group-hover:animate-spin-reverse delay-100"></div>
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-forest-green to-autumn-brown opacity-0 group-hover:opacity-20 blur-md transition-all duration-500 animate-pulse"></div>
                
                <img
                  src={`http://localhost:5000${badge.imageUrl}`}
                  alt={badge.name || "Badge"}
                  className="h-24 w-24 rounded-full border-4 border-forest-green p-1 relative z-10 transition-all duration-500 group-hover:border-secondary-light group-hover:scale-110 group-hover:rotate-12"
                />
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shine"></div>
              </div>
            </div>

            <h3 className="text-xl font-heading font-bold mb-1 text-woodland-brown transition-all duration-300 group-hover:text-forest-green group-hover:scale-105">
              {badge.name || "Untitled"}
            </h3>
            
            <p className="text-sm text-text-secondary mb-2 transition-all duration-300 group-hover:text-autumn-brown">
              {badge.category || "Uncategorized"}
            </p>
            
            <div className="flex justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              {renderDifficulty(badge.difficulty || 2)}
            </div>

            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-forest-green via-secondary-light to-autumn-brown transition-all duration-500 group-hover:w-full"></div>
            
            <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-forest-green to-transparent transition-all duration-500 delay-100 group-hover:h-full"></div>
            <div className="absolute top-0 right-0 w-1 h-0 bg-gradient-to-b from-autumn-brown to-transparent transition-all duration-500 delay-200 group-hover:h-full"></div>
          </div>
        ))}
      </div>
    )}
  </div>

  
</section>

      <section className="py-16 bg-woodland-brown text-white animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-heading font-bold mb-4">Help Us Inspire the Next Generation</h2>
              <p className="mb-4">
                We're always looking for volunteers and helpers to join our team. Whether you can commit to regular
                sessions or just help occasionally, your contribution makes a difference.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-forest-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Flexible scheduling to fit your availability
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-forest-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Training and support provided
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-forest-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Make a positive impact in your community
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-forest-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Build new friendships and connections
                </li>
              </ul>
              <Link
                to="/helper-info"
                className="btn bg-white text-woodland-brown hover:bg-forest-green hover:text-white px-6 py-3 rounded-md inline-block transition-colors duration-200"
              >
                Become a Helper
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src="/assets/become-a-helper.png"
                alt="Volunteer helpers with Cub Scouts"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
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

export default HomePage;