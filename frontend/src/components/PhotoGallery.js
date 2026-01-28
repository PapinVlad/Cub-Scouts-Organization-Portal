
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPhotos, deletePhoto, updatePhoto } from "../utils/api";
import { isAuthenticated, getUserRole, getUserId } from "../utils/auth";

const PhotoGallery = ({ eventId, tag, isPublic = false, searchTerm = "", filter = "all" }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    public_visible: false,
    leaders_only_visible: false,
    file: null,
  });

  const isLoggedIn = isAuthenticated();
  const userRole = isLoggedIn ? getUserRole() : null;
  const userId = isLoggedIn ? getUserId() : null;
  const hasEditDeleteAccess = (photo) => {
    return isLoggedIn && (userRole === "admin" || userRole === "leader" || userId === photo?.uploaded_by);
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);

        let endpoint = "";
        if (eventId) {
          endpoint = `/event/${eventId}`;
        } else if (tag) {
          endpoint = `/tag/${tag}`;
        } else if (isPublic) {
          endpoint = "/public";
        }

        const response = await getPhotos(endpoint);

        if (response.success && response.data && response.data.length > 0) {
        }

        setDebugInfo({
          endpoint,
          response,
          timestamp: new Date().toISOString(),
        });

        if (response.success) {
          let photoData = [];
          if (Array.isArray(response.data)) {
            photoData = response.data;
          } else if (Array.isArray(response.photos)) {
            photoData = response.photos;
          } else if (response.data && Array.isArray(response.data.photos)) {
            photoData = response.data.photos;
          } else {
            console.warn("Unexpected response format:", response);
            photoData = [];
          }

          // Фильтрация по searchTerm и filter
          let filteredPhotos = photoData;
          if (searchTerm) {
            filteredPhotos = filteredPhotos.filter(
              (photo) =>
                photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                photo.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          if (filter === "recent") {
            filteredPhotos = filteredPhotos.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
          } else if (filter === "popular") {
            filteredPhotos = filteredPhotos.sort((a, b) => (b.views || 0) - (a.views || 0));
          } else if (filter === "my" && isLoggedIn) {
            filteredPhotos = filteredPhotos.filter((photo) => photo.uploaded_by === userId);
          }

          setPhotos(filteredPhotos);
        } else {
          setError(response.message || "Failed to fetch photos");
          setPhotos([]);
        }
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError("Error fetching photos. Please try again later.");
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [eventId, tag, isPublic, searchTerm, filter]);

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    setEditForm({
      title: photo.title || "",
      description: photo.description || "",
      public_visible: !!photo.public_visible,
      leaders_only_visible: !!photo.leaders_only_visible,
      file: null,
    });
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    setIsEditing(false);
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      try {
        const response = await deletePhoto(photoId);
        if (response.success) {
          setPhotos(photos.filter((photo) => photo.photo_id !== photoId));
          closePhotoModal();
        } else {
          setError(response.message || "Failed to delete photo");
        }
      } catch (err) {
        console.error("Error deleting photo:", err);
        setError("Error deleting photo. Please try again later.");
      }
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("public_visible", editForm.public_visible);
      formData.append("leaders_only_visible", editForm.leaders_only_visible);
      if (editForm.file) {
        formData.append("image", editForm.file);
      }

      const response = await updatePhoto(selectedPhoto.photo_id, formData);
      if (response.success) {
        setPhotos(
          photos.map((photo) => (photo.photo_id === selectedPhoto.photo_id ? { ...photo, ...response.data } : photo))
        );
        setSelectedPhoto(response.data);
        setIsEditing(false);
      } else {
        setError(response.message || "Failed to update photo");
      }
    } catch (err) {
      console.error("Error updating photo:", err);
      setError("Error updating photo. Please try again later.");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/photo-placeholder.png";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-forest-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-woodland-brown text-lg">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-xl shadow-md mb-4">
        <p className="font-bold text-lg">Error</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:shadow-lg hover:scale-105"
        >
          Reload Page
        </button>
        
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="h-16 w-16 mx-auto text-forest-green mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-2xl font-heading font-medium text-woodland-brown mb-2">No Photos Found</h3>
        <p className="text-text-secondary text-lg">There are no photos in this section yet.</p>
        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-64 mx-auto max-w-2xl">
            <h4 className="font-bold mb-2">Debug Information:</h4>
            <pre className="text-xs text-left">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.photo_id}
            className="bg-white rounded-lg overflow-hidden shadow-md border-2 border-forest-green hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => openPhotoModal(photo)}
          >
            <div className="relative pt-[75%] overflow-hidden ">
              <img
                src={getImageUrl(photo.thumbnail_url || photo.image_url)}
                alt={photo.title || "Photo"}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  console.error(`Error loading image: ${e.target.src}`);
                  e.target.onerror = null;
                  e.target.src = "/photo-placeholder.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-green/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-4">
              <h3 className="font-heading font-bold text-lg text-woodland-brown truncate group-hover:text-forest-green transition-colors">
                {photo.title || "Untitled"}
              </h3>
              {photo.event_name && (
                <p className="text-sm text-text-secondary truncate mt-1">Event: {photo.event_name}</p>
              )}
              {hasEditDeleteAccess(photo) && (
                <button
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhoto(photo.photo_id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Viewing Photo */}
      
{selectedPhoto && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    onClick={closePhotoModal}
  >
    <div
      className="bg-white rounded-xl shadow-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-forest-green"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <button
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-full hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:scale-105"
          onClick={closePhotoModal}
        >
          ×
        </button>

        {isEditing ? (
          <div className="p-8">
            <h2 className="text-3xl font-heading font-bold text-woodland-brown mb-6 drop-shadow">Edit Photo</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-woodland-brown font-medium mb-2 text-lg">Title:</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border-2 border-forest-green rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-scout-green-dark transition-all"
                />
              </div>
              <div>
                <label className="block text-woodland-brown font-medium mb-2 text-lg">Description:</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border-2 border-forest-green rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-scout-green-dark transition-all"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="public_visible"
                  checked={editForm.public_visible}
                  onChange={(e) => setEditForm({ ...editForm, public_visible: e.target.checked })}
                  className="mr-2 h-5 w-5 text-forest-green focus:ring-forest-green"
                />
                <label htmlFor="public_visible" className="text-woodland-brown text-lg">
                  Visible to All
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="leaders_only_visible"
                  checked={editForm.leaders_only_visible}
                  onChange={(e) => setEditForm({ ...editForm, leaders_only_visible: e.target.checked })}
                  className="mr-2 h-5 w-5 text-forest-green focus:ring-forest-green"
                />
                <label htmlFor="leaders_only_visible" className="text-woodland-brown text-lg">
                  Visible to Leaders Only
                </label>
              </div>
              <div>
                <label className="block text-woodland-brown font-medium mb-2 text-lg">
                  New Image (Optional):
                </label>
                <input
                  type="file"
                  onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] })}
                  className="w-full border-2 border-forest-green rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-scout-green-dark transition-all"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleUpdatePhoto}
                  className="px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:flex items-center ">
            <div className="md:w-2/3 bg-gradient-to-br from-background-beige to-forest-green/10  ">
              <img
                src={getImageUrl(selectedPhoto.image_url) || "/photo-placeholder.png"}
                alt={selectedPhoto.title || "Photo"}
                className="w-full h-auto max-h-[70vh] object-contain transition-transform hover:scale-105 duration-300"
                onError={(e) => {
                  console.error(`Error loading modal image: ${e.target.src}`);
                  e.target.onerror = null;
                  e.target.src = "/photo-placeholder.png";
                }}
              />
            </div>
            <div className="md:w-1/3 p-8">
              <h2 className="text-3xl font-heading font-bold text-woodland-brown mb-4 drop-shadow">
                {selectedPhoto.title || "Untitled"}
              </h2>
              {selectedPhoto.description && (
                <p className="text-text-secondary text-lg mb-6">{selectedPhoto.description}</p>
              )}
              {selectedPhoto.event_name && (
                <p className="mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-forest-green"
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
                  <span className="text-woodland-brown">Event: </span>
                  <Link
                    to={`/events/${selectedPhoto.event_id}`}
                    className="ml-1 text-forest-green hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedPhoto.event_name}
                  </Link>
                </p>
              )}
              {selectedPhoto.uploader_name && (
                <p className="mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-forest-green"
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
                  <span className="text-woodland-brown">Uploaded by: </span>
                  <span className="ml-1">{selectedPhoto.uploader_name}</span>
                </p>
              )}
              {selectedPhoto.upload_date && (
                <p className="mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-forest-green"
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
                  <span className="text-woodland-brown">Upload Date: </span>
                  <span className="ml-1">{new Date(selectedPhoto.upload_date).toLocaleDateString()}</span>
                </p>
              )}
              {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-woodland-brown font-medium mb-2 text-lg">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/photos?tag=${tag}`}
                        className="px-3 py-1 bg-forest-green/20 text-woodland-brown rounded-full text-sm hover:bg-gradient-to-r hover:from-forest-green hover:to-scout-green-dark hover:text-white transition-all duration-300 hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {hasEditDeleteAccess(selectedPhoto) && (
                <div className="flex space-x-4 mt-4">
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-forest-green to-scout-green-dark text-white rounded-lg hover:from-primary-dark hover:to-scout-green transition-all flex items-center shadow-md hover:shadow-lg hover:scale-105"
                    onClick={() => setIsEditing(true)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center shadow-md hover:shadow-lg hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(selectedPhoto.photo_id);
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PhotoGallery;