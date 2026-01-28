"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const AnnouncementForm = ({ announcement = null, isEdit = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    content: announcement?.content || "",
    startDate: announcement?.start_date ? new Date(announcement.start_date).toISOString().split("T")[0] : "",
    endDate: announcement?.end_date ? new Date(announcement.end_date).toISOString().split("T")[0] : "",
    priority: announcement?.priority || "normal",
    targetRole: announcement?.target_role || "all",
    isActive: announcement?.is_active !== undefined ? announcement.is_active : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit && announcement) {
        await api.put(`/announcements/${announcement.announcement_id}`, formData);
      } else {
        await api.post("/announcements", formData);
      }

      navigate("/admin/announcements");
    } catch (error) {
      console.error("Error saving announcement:", error);
      setError("Failed to save announcement. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-beige pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 z-0" style={{ backgroundImage: "url('/paper-texture.jpg')" }}></div>

      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-forest-green relative z-10 notebook-page">
        <h2 className="text-3xl font-heading font-bold text-woodland-brown mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2 text-forest-green"
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
          {isEdit ? "Edit Scout Note" : "Write a New Scout Note"}
        </h2>

        {error && (
          <div className="bg-error bg-opacity-20 border border-error text-error px-4 py-3 rounded mb-6 text-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-woodland-brown mb-1">
              Note Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-forest-green rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green text-woodland-brown bg-background-beige"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-woodland-brown mb-1">
              Note Details:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              required
              className="w-full px-4 py-2 border border-forest-green rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green text-woodland-brown bg-background-beige"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-woodland-brown mb-1">
                Start Date (Optional):
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-forest-green rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green text-woodland-brown bg-background-beige"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-woodland-brown mb-1">
                End Date (Optional):
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-forest-green rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green text-woodland-brown bg-background-beige"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-woodland-brown mb-1">
                Priority Level:
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-forest-green rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green text-woodland-brown bg-background-beige"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetRole" className="block text-sm font-medium text-woodland-brown mb-1">
                Target Scouts:
              </label>
              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-forest-green rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green text-woodland-brown bg-background-beige"
              >
                <option value="all">All Scouts</option>
                <option value="leader">Leaders Only</option>
                <option value="helper">Helpers Only</option>
                <option value="public">Public Scouts Only</option>
              </select>
            </div>
          </div>

          {isEdit && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-forest-green focus:ring-forest-green border-woodland-brown rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-woodland-brown">
                Keep Active
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/announcements")}
              className="px-4 py-2 border border-woodland-brown rounded-full text-sm font-medium text-woodland-brown bg-white hover:bg-woodland-brown hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-forest-green hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
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
                  {isEdit ? "Update Note" : "Pin Note"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;