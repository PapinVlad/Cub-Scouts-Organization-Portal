// Contact Us Page
//
// Core Functionality:
// - Provides comprehensive contact information for Cub Scout organization
// - Displays interactive Google Maps location with transport information
// - Shows upcoming events with expandable details
// - Lists social media channels with direct links
// - Presents FAQ section with common questions and answers
//
// Navigation & Structure:
// - Features sticky navigation tabs for easy section access
// - Implements smooth scrolling between page sections
// - Uses parallax hero section with decorative wave divider
// - Organizes content in visually distinct card sections
//
// Interactive Elements:
// - Expandable event cards with click/keyboard accessibility
// - Hover effects on social media links with scaling animations
// - Floating action button for quick phone calls
// - Scroll-to-top button for improved navigation
//
// Data Integration:
// - Fetches and displays upcoming events from API
// - Formats dates and times for user-friendly display
// - Filters events to show only future occurrences
// - Handles loading states and empty data scenarios
//
// Uses Tailwind CSS with nature-themed color scheme and Lucide React icons.
// Client-side rendered with "use client" directive.
"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Phone, Mail, Clock, Calendar, Users, Award, Compass, Facebook, Twitter, Instagram } from "lucide-react"
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Link } from "react-router-dom"
import api from "../utils/api";

const ContactUsPage = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [events, setEvents] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse] = await Promise.all([
          api.get("/events"),
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const displayedEvents = filteredEvents.slice(0, 3);

  useScrollAnimation();

  return (
    <div className="bg-background-beige min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-80 md:h-96 overflow-hidden bg-woodland-brown">
       <div className="absolute inset-0">
          <img
            src="/Parallax-ezgif.com-speed.gif" 
            alt="Obanshire Cub Scouts Adventure Animation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-woodland-brown opacity-70"></div>
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-accent font-bold mb-6 drop-shadow-lg">Contact Us</h1>
          <p className="text-xl md:text-2xl font-sans mb-8 max-w-3xl mx-auto drop-shadow">
            We're here to help you connect with our Cub Scout community
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 100L60 80C120 60 240 20 360 20C480 20 600 60 720 80C840 100 960 100 1080 80C1200 60 1320 20 1380 0L1440 0V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z"
              fill="#F5F5DC"
            />
          </svg>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 space-x-4 scrollbar-hide flex-wrap ">
            <button
              onClick={() => {
                setActiveSection("general")
                document.getElementById("general").scrollIntoView({ behavior: "smooth" })
              }}
              className={`px-4 py-2 whitespace-nowrap font-medium rounded-full transition-all duration-300 ${
                activeSection === "general"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary-dark hover:bg-primary-light"
              }`}
            >
              Get In Touch
            </button>
            <button
              onClick={() => {
                setActiveSection("location")
                document.getElementById("location").scrollIntoView({ behavior: "smooth" })
              }}
              className={`px-4 py-2 whitespace-nowrap font-medium rounded-full transition-all duration-300 ${
                activeSection === "location"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary-dark hover:bg-primary-light"
              }`}
            >
              Find Us
            </button>
            <button
              onClick={() => {
                setActiveSection("meetings")
                document.getElementById("meetings").scrollIntoView({ behavior: "smooth" })
              }}
              className={`px-4 py-2 whitespace-nowrap font-medium rounded-full transition-all duration-300 ${
                activeSection === "meetings"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary-dark hover:bg-primary-light"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => {
                setActiveSection("social")
                document.getElementById("social").scrollIntoView({ behavior: "smooth" })
              }}
              className={`px-4 py-2 whitespace-nowrap font-medium rounded-full transition-all duration-300 ${
                activeSection === "social"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary-dark hover:bg-primary-light"
              }`}
            >
              Connect With Us
            </button>
            <button
              onClick={() => {
                setActiveSection("faq")
                document.getElementById("faq").scrollIntoView({ behavior: "smooth" })
              }}
              className={`px-4 py-2 whitespace-nowrap font-medium rounded-full transition-all duration-300 ${
                activeSection === "faq"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary-dark hover:bg-primary-light"
              }`}
            >
              FAQ
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* General Information Section */}
        <section id="general" className="mb-16 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-secondary mb-6 flex items-center">
                  <span className="bg-primary-light p-2 rounded-full mr-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </span>
                  Get In Touch
                </h2>
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex items-start">
                      <div className="bg-primary p-3 rounded-full text-white mr-4 group-hover:bg-secondary transition-colors duration-300 transform group-hover:scale-110">
                        <MapPin size={24} className="group-hover:animate-bounce" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary text-lg group-hover:text-primary transition-colors duration-300">
                          Our Location
                        </h3>
                        <p className="text-secondary-light mt-2 leading-relaxed">
                          123 Scout Hall Lane
                          <br />
                          Obanshire, OB1 2CD
                          <br />
                          United Kingdom
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start">
                      <div className="bg-primary p-3 rounded-full text-white mr-4 group-hover:bg-secondary transition-colors duration-300 transform group-hover:scale-110">
                        <Phone size={24} className="group-hover:animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary text-lg group-hover:text-primary transition-colors duration-300">
                          Phone
                        </h3>
                        <p className="text-secondary-light mt-2 leading-relaxed">
                          Main Office: +44 1234 567890
                          <br />
                          Scout Leader: +44 1234 098765
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex items-start">
                      <div className="bg-primary p-3 rounded-full text-white mr-4 group-hover:bg-secondary transition-colors duration-300 transform group-hover:scale-110">
                        <Mail size={24} className="group-hover:rotate-12 transition-transform" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary text-lg group-hover:text-primary transition-colors duration-300">
                          Email
                        </h3>
                        <p className="text-secondary-light mt-2 leading-relaxed">
                          General Inquiries: <span className="text-primary">info@obanshirecubscouts.org</span>
                          <br />
                          Membership: <span className="text-primary">join@obanshirecubscouts.org</span>
                          <br />
                          Volunteering: <span className="text-primary">volunteer@obanshirecubscouts.org</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-accent-light p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <img
                    src="/assets/Logo.svg"
                    alt="Obanshire Cub Scouts Logo"
                    className="w-48 h-48 object-contain mx-auto mb-6 drop-shadow-md hover:drop-shadow-xl transition-all duration-300 transform hover:scale-105"
                  />
                  <h3 className="text-2xl font-bold text-secondary mb-3">Obanshire Cub Scouts</h3>
                  <p className="text-secondary-light max-w-md mx-auto">
                    Building character, teaching skills, and creating memories that last a lifetime. Join our community
                    of young adventurers!
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section with Map */}
        <section
          id="location"
          className="mb-16 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8"
          onMouseEnter={() => setActiveSection("location")}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex flex-row-reverse">
              <div className="md:w-3/5  relative">
                <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center z-0">
                  <p className="text-gray-600">Loading map...</p>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9552.080507813654!2d-0.12775968293263869!3d51.50736468087333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2sScout%20Association!5e0!3m2!1sen!2sus!4v1621436761619!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Obanshire Cub Scouts Location"
                  className="relative z-10"
                  onLoad={() => setIsMapLoaded(true)}
                ></iframe>
              </div>
              <div className="md:w-2/5 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-secondary mb-6 flex items-center">
                  <span className="bg-primary-light p-2 rounded-full mr-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </span>
                  Find Us
                </h2>
                <div className="space-y-6">
                  <p className="text-secondary-light leading-relaxed">
                    Our Scout Hall is located near the center of Obanshire, with ample parking and easy access via
                    public transport.
                  </p>

                  <div className="bg-background-dark p-4 rounded-lg">
                    <h3 className="font-semibold text-secondary">Public Transport</h3>
                    <ul className="mt-2 space-y-2 text-secondary-light">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span> Bus routes 12, 15, and 42 stop within a 2-minute
                        walk
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span> Obanshire Train Station is a 10-minute walk
                      </li>
                    </ul>
                  </div>

                  <div className="bg-background-dark p-4 rounded-lg">
                    <h3 className="font-semibold text-secondary">Parking</h3>
                    <ul className="mt-2 space-y-2 text-secondary-light">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span> Free parking available on-site
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span> Additional parking at Obanshire Community Center
                        (2-minute walk)
                      </li>
                    </ul>
                  </div>

                  <div className="bg-background-dark p-4 rounded-lg">
                    <h3 className="font-semibold text-secondary">Accessibility</h3>
                    <ul className="mt-2 space-y-2 text-secondary-light">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span> Wheelchair accessible entrance and facilities
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span> Accessible parking spaces available
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meeting Times Section */}
        <section
          id="meetings"
          className="mb-16 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8"
          onMouseEnter={() => setActiveSection("meetings")}
        >
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
        </section>

        {/* Social Media Section */}
        <section
          id="social"
          className="mb-16 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8"
          onMouseEnter={() => setActiveSection("social")}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-secondary mb-8 flex items-center">
                <span className="bg-primary-light p-2 rounded-full mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </span>
                Connect With Us
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-blue-50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 hover:bg-blue-100">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Facebook className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">Facebook</h3>
                  <p className="text-secondary-light mb-4">
                    Follow our page for event updates, photos, and community news.
                  </p>
                  <a
                    href="https://facebook.com/obanshirecubscouts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 font-medium hover:underline"
                  >
                    @ObanshireCubScouts
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                <div className="group bg-blue-50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 hover:bg-blue-100">
                  <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Twitter className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">Twitter</h3>
                  <p className="text-secondary-light mb-4">Quick updates, scouting news, and community engagement.</p>
                  <a
                    href="https://twitter.com/obanshirescouts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 font-medium hover:underline"
                  >
                    @ObanshireScouts
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                <div className="group bg-pink-50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 hover:bg-pink-100">
                  <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">Instagram</h3>
                  <p className="text-secondary-light mb-4">Photos and videos from our activities, camps, and events.</p>
                  <a
                    href="https://instagram.com/obanshirescouts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-pink-600 font-medium hover:underline"
                  >
                    @ObanshireScouts
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="mb-16 animate-on-scroll opacity-0 transition-all duration-700 translate-y-8"
          onMouseEnter={() => setActiveSection("faq")}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-secondary mb-8 flex items-center">
                <span className="bg-primary-light p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                Frequently Asked Questions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group bg-background-beige rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                    How old does my child need to be to join?
                  </h3>
                  <p className="text-secondary-light">
                    Beaver Scouts: 6-8 years old
                    <br />
                    Cub Scouts: 8-10.5 years old
                    <br />
                    Scouts: 10.5-14 years old
                  </p>
                </div>

                <div className="group bg-background-beige rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                    How much does it cost?
                  </h3>
                  <p className="text-secondary-light">
                    Membership is £45 per term, which covers weekly meetings, badges, and insurance. Additional costs
                    may apply for camps and special activities.
                  </p>
                </div>

                <div className="group bg-background-beige rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                    Do you have a waiting list?
                  </h3>
                  <p className="text-secondary-light">
                    Some of our groups do have waiting lists. We recommend registering your interest as early as
                    possible. Priority is given to siblings of current members.
                  </p>
                </div>

                <div className="group bg-background-beige rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                    How can I volunteer?
                  </h3>
                  <p className="text-secondary-light">
                    We're always looking for adult volunteers! You can help regularly as a leader or occasionally as a
                    helper. No experience necessary - we provide all training. Please contact us for more information.
                  </p>
                </div>

                <div className="group bg-background-beige rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                    What do children need to bring to meetings?
                  </h3>
                  <p className="text-secondary-light">
                    Children should wear their uniform to meetings. Depending on the planned activities, we may ask them
                    to bring specific items, which will be communicated in advance.
                  </p>
                </div>

                <div className="group bg-background-beige rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                    What activities do you offer?
                  </h3>
                  <p className="text-secondary-light">
                    We offer a wide range of activities including outdoor adventures, crafts, games, sports, community
                    service, and skill-building exercises. Our program is designed to develop confidence, teamwork, and
                    leadership.
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-secondary-light mb-6">
                  Don't see your question answered here? Feel free to contact us directly!
                </p>
                <div className="inline-flex items-center justify-center bg-primary text-white font-medium rounded-full px-6 py-3 hover:bg-primary-dark transition-colors duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>info@obanshirecubscouts.org</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
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
  )
}

export default ContactUsPage
