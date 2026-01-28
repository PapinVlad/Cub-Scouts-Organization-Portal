"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPhoto } from "../utils/api";
import { isAuthenticated, getUserRole } from "../utils/auth";
import axios from "axios";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const PhotoUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagCategories, setTagCategories] = useState([]);
  const [publicVisible, setPublicVisible] = useState(true);
  const [leadersOnlyVisible, setLeadersOnlyVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  const [tagsError, setTagsError] = useState(null);

  const navigate = useNavigate();
  const isLeader = getUserRole() === "leader";

  useScrollAnimation(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/photos/upload" } });
      return;
    }

    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/events`, {
          headers: {
            "x-auth-token": token,
          },
        });

        if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        } else if (response.data && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          console.warn("Unexpected events response format:", response.data);
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    const fetchTags = async () => {
      setLoadingTags(true);
      setTagsError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/photo-tags/categories`, {
          headers: {
            "x-auth-token": token,
          },
        });
        setDebugInfo(JSON.stringify(response.data, null, 2));

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setTagCategories(response.data.data);
        } else {
          console.warn("Unexpected tags response format:", response.data);
          setTagCategories([]);
          setTagsError("Unexpected response format from server");
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        setTagCategories([]);
        setTagsError(`Error fetching tags: ${err.message}`);
        setDebugInfo(
          JSON.stringify(
            {
              message: err.message,
              response: err.response?.data,
              status: err.response?.status,
              headers: err.response?.headers,
            },
            null,
            2
          )
        );

        try {
          const token = localStorage.getItem("token");

          const categoriesResponse = await axios.get(`${API_URL}/photo-tags/direct-categories`, {
            headers: {
              "x-auth-token": token,
            },
          });

          if (
            categoriesResponse.data &&
            categoriesResponse.data.success &&
            Array.isArray(categoriesResponse.data.data)
          ) {
            const categories = categoriesResponse.data.data;
            console.log("Direct categories:", categories);

            const formattedCategories = categories.map((category) => ({
              category_id: category.category_id,
              category_name: category.name,
              tags: [],
            }));

            for (const category of formattedCategories) {
              try {
                const tagsResponse = await axios.get(`${API_URL}/photo-tags/direct-tags/${category.category_id}`, {
                  headers: {
                    "x-auth-token": token,
                  },
                });

                if (tagsResponse.data && tagsResponse.data.success && Array.isArray(tagsResponse.data.data)) {
                  category.tags = tagsResponse.data.data;
                }
              } catch (tagErr) {
                console.error(`Error fetching tags for category ${category.category_id}:`, tagErr);
              }
            }

            setTagCategories(formattedCategories);
            setTagsError("Used alternative method to fetch tags");
          }
        } catch (altErr) {
          console.error("Error with alternative method:", altErr);
          setTagsError(`Error with alternative method for fetching tags: ${altErr.message}`);
        }
      } finally {
        setLoadingTags(false);
      }
    };

    fetchEvents();
    fetchTags();
  }, [navigate, API_URL]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("description", description);
      if (eventId) formData.append("event_id", eventId);
      formData.append("public_visible", publicVisible);
      formData.append("leaders_only_visible", leadersOnlyVisible);

      if (selectedTags.length > 0) {
        formData.append("tags", JSON.stringify(selectedTags));
      }

      const response = await uploadPhoto(formData);

      if (response.success) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setFile(null);
        setPreview(null);
        setEventId("");
        setSelectedTags([]);
        setPublicVisible(true);
        setLeadersOnlyVisible(false);

        setTimeout(() => {
          navigate("/photos");
        }, 2000);
      } else {
        setError(response.message || "Failed to upload photo");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError("Error uploading photo. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderTags = () => {
    if (loadingTags) {
      return (
        <p className="text-text-secondary font-sans">Loading tags...</p>
      );
    }

    if (tagsError) {
      return (
        <div className="border-l-4 border-red-500 bg-red-100 p-4 rounded-lg">
          <p className="text-red-700 font-sans">{tagsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:shadow-lg hover:scale-105 font-sans"
          >
            Reload Page
          </button>
        </div>
      );
    }

    if (tagCategories.length === 0) {
      return (
        <p className="text-text-secondary font-sans">No tags available. Tags will be added by an administrator.</p>
      );
    }

    return (
      <div className="space-y-4">
        {tagCategories.map((category) => (
          <div key={category.category_id}>
            <h4 className="text-lg font-accent font-bold text-woodland-brown mb-2">{category.category_name}</h4>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(category.tags) && category.tags.length > 0 ? (
                category.tags.map((tag) => (
                  <div
                    key={tag.tag_id}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-sans ${
                      selectedTags.includes(tag.tag)
                        ? "bg-forest-green text-white"
                        : "bg-forest-green/20 text-woodland-brown hover:bg-forest-green/40"
                    }`}
                    onClick={() => handleTagToggle(tag.tag)}
                  >
                    {tag.tag}
                  </div>
                ))
              ) : (
                <p className="text-text-secondary font-sans">No tags in this category</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-background-beige min-h-screen">
      <h2 className="text-4xl font-accent font-bold text-woodland-brown mb-8 text-center drop-shadow animate-slideIn">
        Upload New Photo
      </h2>

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg mb-8 animate-zoomIn">
          <p className="font-sans text-lg">Photo uploaded successfully! Redirecting to gallery...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8 animate-zoomIn">
          <p className="font-sans text-lg">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border-2 border-forest-green p-8 max-w-3xl mx-auto animate-slideIn relative">
        <div className="absolute top-4 left-4">
          <svg className="h-12 w-12 text-forest-green opacity-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>

        <div className="space-y-8">
          <div className="relative">
            <label htmlFor="title" className="block text-woodland-brown font-medium mb-2 text-lg font-sans">
              Title:
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none top-8">
              <svg className="h-5 w-5 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter photo title"
              className="pl-12 w-full border-2 border-forest-green rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-green transition-all font-sans"
            />
          </div>

          <div className="relative">
            <label htmlFor="description" className="block text-woodland-brown font-medium mb-2 text-lg font-sans">
              Description:
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-start pt-3 pointer-events-none top-8">
              <svg className="h-5 w-5 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12h18M3 6h18M3 18h18"
                />
              </svg>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter photo description"
              rows="4"
              className="pl-12 w-full border-2 border-forest-green rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-green transition-all font-sans"
            />
          </div>

          <div className="relative">
            <label htmlFor="event" className="block text-woodland-brown font-medium mb-2 text-lg font-sans">
              Event (Optional):
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none top-8">
              <svg className="h-5 w-5 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <select
              id="event"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              disabled={loadingEvents || events.length === 0}
              className="pl-12 w-full border-2 border-forest-green rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-green transition-all font-sans"
            >
              <option value="">-- Select Event --</option>
              {loadingEvents ? (
                <option value="" disabled>
                  Loading events...
                </option>
              ) : events.length === 0 ? (
                <option value="" disabled>
                  No events available
                </option>
              ) : (
                events.map((event) => (
                  <option key={event.event_id || event.id} value={event.event_id || event.id}>
                    {event.title} 
                  </option>
                ))
              )}
            </select>
            {events.length === 0 && !loadingEvents && (
              <p className="text-text-secondary mt-2 font-sans">
                No events available. Create an event before uploading photos.
              </p>
            )}
          </div>

          <div className="border-t border-forest-green pt-6">
            <label className="block text-woodland-brown font-medium mb-2 text-lg font-sans">Tags:</label>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="pl-10">{renderTags()}</div>
            </div>
            <div className="border-t border-forest-green pt-4">
              <p className="text-lg text-woodland-brown font-sans">
                Selected Tags: {selectedTags.length > 0 ? selectedTags.join(", ") : "No tags selected"}
              </p>
            </div>
          </div>

          <div className="border-t border-forest-green pt-6">
            <label className="block text-woodland-brown font-medium mb-2 text-lg font-sans">Visibility:</label>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="publicVisible"
                  checked={publicVisible}
                  onChange={(e) => setPublicVisible(e.target.checked)}
                  className="mr-2 h-5 w-5 text-forest-green focus:ring-forest-green"
                />
                <label htmlFor="publicVisible" className="text-woodland-brown text-lg font-sans">
                  Public
                </label>
              </div>

              {isLeader && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="leadersOnlyVisible"
                    checked={leadersOnlyVisible}
                    onChange={(e) => setLeadersOnlyVisible(e.target.checked)}
                    className="mr-2 h-5 w-5 text-forest-green focus:ring-forest-green"
                  />
                  <label htmlFor="leadersOnlyVisible" className="text-woodland-brown text-lg font-sans">
                    Leaders Only
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-forest-green pt-6">
            <label htmlFor="photo" className="block text-woodland-brown font-medium mb-2 text-lg font-sans">
              Select Photo:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="pl-12 w-full border-2 border-forest-green rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-green transition-all font-sans"
              />
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview || "/photo-placeholder.png"}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border-2 border-forest-green shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-6 border-t border-forest-green">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center font-sans"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                "Upload Photo"
              )}
            </button>
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all shadow-md hover:shadow-lg hover:scale-105 font-sans"
              onClick={() => navigate("/photos")}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      
    </div>
  );
};

export default PhotoUpload;