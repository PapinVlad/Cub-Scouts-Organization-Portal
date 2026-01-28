"use client";

import { useState, useEffect } from "react";
import api from "../../utils/api";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await api.get("/announcements");

        if (response.data && response.data.success) {
          setAnnouncements(response.data.announcements);
        } else {
          setError("Failed to load announcements. Please try again later.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError("Failed to load announcements. Please try again later.");
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPinColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "normal":
        return "text-forest-green";
      case "low":
        return "text-green-500";
      default:
        return "text-woodland-brown";
    }
  };

  const getNoteStyle = (index) => {
    const tilt = (index % 2 === 0 ? -2 : 2) + (Math.random() * 2 - 1);
    return {
      transform: `rotate(${tilt}deg)`,
      transition: "transform 0.3s ease",
    };
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

  if (error) {
    return (
      <div className="bg-error bg-opacity-20 border border-error text-error px-4 py-3 rounded my-4 text-center">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-woodland-brown shadow-md">
        <p className="text-woodland-brown font-medium">No notices on the board yet. Check back soon!</p>
      </div>
    );
  }
console.log(announcements);
  return (
    <div className="min-h-screen bg-background-beige pt-20 pb-12 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-heading font-bold text-woodland-brown mb-8 drop-shadow-lg">
          Scout Bulletin Board
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {announcements.map((announcement, index) => (

            <div
              key={announcement.announcement_id}
              className="relative bg-white rounded-lg shadow-lg p-6 border border-forest-green note-tilt hover:shadow-xl"
              style={getNoteStyle(index)}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 ${getPinColor(announcement.priority)} drop-shadow`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
                </svg>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <h3 className="text-xl font-heading font-bold text-woodland-brown">{announcement.title}</h3>
                <div className="flex flex-col items-end mt-2 sm:mt-0">
                  <span className="text-sm text-forest-green">
                    Posted: {formatDate(announcement.created_at)}
                  </span>
                  {announcement.priority !== "normal" && (
                    <span
                      className={`mt-1 px-2 py-1 text-xs font-bold rounded uppercase text-white ${getPinColor(
                        announcement.priority
                      ).replace("text-", "bg-")}`}
                    >
                      {announcement.priority}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-woodland-brown mb-4">
                {announcement.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-forest-green text-sm text-forest-green">
                <span className="mb-1 sm:mb-0">
                  Posted by: <span className="font-medium">{announcement.creator_name || "Scout Leader"}</span>
                </span>
                {announcement.end_date && (
                  <span className="text-forest-green">
                    Valid until: {formatDate(announcement.end_date)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementList;