// Photo Detail Page
//
// Core Functionality:
// - Displays detailed view of individual photos with metadata
// - Fetches photo data from API based on URL parameter ID
// - Provides edit and delete capabilities for authorized users
// - Implements permission checking based on user role and ownership
//
// User Interface:
// - Presents photo in responsive layout with metadata sidebar
// - Offers navigation back to photo gallery
// - Displays contextual information (event, uploader, date)
// - Provides visual feedback during loading and error states
//
// Security & Permissions:
// - Restricts edit/delete actions to photo owner, leaders, and admins
// - Implements confirmation modal for destructive actions
// - Handles unauthorized access with appropriate redirects
//
// State Management:
// - Tracks loading and error states during API operations
// - Manages deletion confirmation workflow
// - Handles image loading errors with fallback images
// - Provides optimistic UI updates during operations
//
// Uses Tailwind CSS with nature-themed color scheme and custom animations.
// Client-side rendered with "use client" directive.
"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPhotoById, deletePhoto } from "../utils/api";
import { getUserId, getUserRole, isAuthenticated } from "../utils/auth";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const PhotoDetailPage = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const userId = getUserId();
  const userRole = getUserRole();
  const isAuth = isAuthenticated();

  useScrollAnimation(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setLoading(true);
        const response = await getPhotoById(id);

        if (response.success) {
          setPhoto(response.photo);
        } else {
          setError(response.message || "Failed to fetch photo");
        }
      } catch (err) {
        console.error("Error fetching photo:", err);
        setError("Error fetching photo. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPhoto();
  }, [id]);

  const canEditOrDelete =
    isAuth && photo && (userId === photo.uploaded_by || userRole === "leader" || userRole === "admin");

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deletePhoto(id);

      if (response.success) {
        navigate("/photos", {
          state: {
            message: "Photo deleted successfully",
            timestamp: Date.now(),
          },
        });
      } else {
        setError(response.message || "Failed to delete photo");
      }
    } catch (err) {
      console.error("Error deleting photo:", err);
      setError(err.response?.data?.message || "Error deleting photo. Please try again later.");

      if (err.response?.status === 401) {
        navigate("/login", { state: { from: location.pathname } });
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleModalClose = (e) => {
    if (e.target.classList.contains("delete-confirm-modal")) {
      setShowDeleteConfirm(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "/photo-placeholder.png";
    if (url.startsWith("http")) return url;
    return `${process.env.REACT_APP_API_URL || "http://localhost:5000"}${url}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center bg-background-beige min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-forest-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-woodland-brown text-lg font-sans">Loading photo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 bg-background-beige min-h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-md animate-slideIn">
          <p className="font-bold text-lg font-accent text-red-700">Error</p>
          <p className="text-base font-sans">{error}</p>
          <button
            onClick={() => navigate("/photos")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="container mx-auto px-4 py-16 bg-background-beige min-h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-xl shadow-md animate-slideIn">
          <p className="font-bold text-lg font-accent text-yellow-700">Photo Not Found</p>
          <p className="text-base font-sans">The requested photo does not exist or has been deleted.</p>
          <button
            onClick={() => navigate("/photos")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-background-beige min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-slideIn">
        <Link
          to="/photos"
          className="inline-flex items-center text-woodland-brown hover:text-forest-green transition-colors mb-4 md:mb-0 group"
        >
          <svg
            className="h-6 w-6 mr-2 text-forest-green group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-sans text-lg">Return to Gallery</span>
        </Link>

        {canEditOrDelete && (
          <div className="flex space-x-4">
            <Link
              to={`/photos/${id}/edit`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              <svg
                className="h-5 w-5 mr-2"
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
              Edit
            </Link>
            <button
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg hover:scale-105"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
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
                  Delete
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md border-2 border-forest-green overflow-hidden animate-slideIn">
        <div className="relative md:flex">
          <div className="absolute top-4 left-4">
            <svg className="h-12 w-12 text-forest-green opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l-8 4v12l8 4 8-4V6l-8-4zm0 2.5L18 7v10l-6 3-6-3V7l6-2.5z" />
            </svg>
          </div>

          <div className="md:w-2/3 relative bg-gradient-to-br from-background-beige to-forest-green/10 border-r-2 border-forest-green">
            <img
              src={getImageUrl(photo.image_url) || "/photo-placeholder.png"}
              alt={photo.title || "Photo"}
              className="w-full h-auto object-contain max-h-[600px] border-2 border-forest-green transition-transform hover:scale-105 duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/photo-placeholder.png";
              }}
            />
          </div>

          <div className="md:w-1/3 p-8">
            <h1 className="text-3xl font-accent font-bold text-woodland-brown mb-6 drop-shadow">
              {photo.title || "Untitled"}
            </h1>

            {photo.description && (
              <div className="mb-6">
                <p className="text-text-secondary text-lg font-sans">{photo.description}</p>
              </div>
            )}

            <div className="space-y-6 text-base">
              {photo.event_name && (
                <div className="flex items-start border-t border-forest-green pt-4">
                  <svg
                    className="h-6 w-6 mr-3 text-forest-green flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-woodland-brown font-sans">Event:</p>
                    <Link
                      to={`/events/${photo.event_id}`}
                      className="text-forest-green hover:underline font-sans"
                    >
                      {photo.event_name}
                    </Link>
                  </div>
                </div>
              )}

              {photo.uploader_name && (
                <div className="flex items-start border-t border-forest-green pt-4">
                  <svg
                    className="h-6 w-6 mr-3 text-forest-green flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-woodland-brown font-sans">Uploaded by:</p>
                    <p className="text-text-secondary font-sans">{photo.uploader_name}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start border-t border-forest-green pt-4">
                <svg
                  className="h-6 w-6 mr-3 text-forest-green flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-woodland-brown font-sans">Upload Date:</p>
                  <p className="text-text-secondary font-sans">
                    {new Date(photo.upload_date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 delete-confirm-modal animate-zoomIn"
          onClick={handleModalClose}
        >
          <div
            className="bg-white rounded-xl shadow-md p-8 max-w-md w-full border-2 border-forest-green"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-accent font-bold text-woodland-brown mb-4">Confirm Deletion</h2>
            <p className="text-text-secondary mb-6 text-lg font-sans">
              Are you sure you want to delete this photo? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-6 py-3 border-2 border-forest-green text-woodland-brown rounded-lg hover:bg-background-beige transition-all shadow-md hover:shadow-lg hover:scale-105"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all flex items-center shadow-md hover:shadow-lg hover:scale-105"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoDetailPage;