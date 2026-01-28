"use client";

import { useState, useEffect } from "react";
import api from "../utils/api";

const UserBadges = ({ userId, isCurrentUser }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        const response = await api.get(`/achievements/user/${userId}`);
        setBadges(response.data.badges);
      } catch (error) {
        console.error("Error fetching user badges:", error);
        setError("Failed to load badges. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBadges();
  }, [userId]);

  const getNoteStyle = (index) => {
    const tilt = (index % 2 === 0 ? -2 : 2) + (Math.random() * 2 - 1);
    return {
      transform: `rotate(${tilt}deg)`,
      transition: "transform 0.3s ease",
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-forest-green border-t-transparent"></div>
        <span className="ml-3 text-woodland-brown">Unveiling badges...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error bg-opacity-20 border border-error text-error px-4 py-3 rounded my-4">
        <p>{error}</p>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="user-badges">
        <h3 className="text-xl font-bold text-woodland-brown mb-4">Earned Scout Patches</h3>
        <p className="text-woodland-brown py-6 text-center bg-white rounded-lg border border-forest-green">
          {isCurrentUser ? "You haven't" : "This scout hasn't"} earned any patches yet.
        </p>
      </div>
    );
  }

  return (
    <div className="user-badges">
      <h3 className="text-2xl font-heading font-bold text-woodland-brown mb-6 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 text-forest-green"
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
        Earned Scout Patches ({badges.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {badges.map((achievement, index) => (
          <div
            key={achievement.id}
            className="relative bg-white rounded-lg shadow-md p-4 border border-forest-green note-tilt hover:shadow-lg"
            style={getNoteStyle(index)}
          >
            {/* Pin Icon */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-forest-green drop-shadow"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a1 1 0 011 1v10l4-4 2 2-6 6-6-6 2-2 4 4V3a1 1 0 011-1z" />
              </svg>
            </div>

            <div className="flex items-center">
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-background-beige border-r border-woodland-brown">
                {achievement.badge.imageUrl ? (
                  <img
                    src={`http://localhost:5000${achievement.badge.imageUrl}`}
                    alt={achievement.badge.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-badge.png";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-forest-green flex items-center justify-center text-white text-xl font-bold">
                    <span>{achievement.badge.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-2 flex-grow">
                <h4 className="font-bold text-woodland-brown">{achievement.badge.name}</h4>
                <span className="inline-block px-2 py-1 bg-forest-green text-white text-xs rounded-full mb-2">
                  {achievement.badge.category}
                </span>
                <div className="text-sm text-woodland-brown">
                  <div className="mb-1">Earned: {new Date(achievement.awardedDate).toLocaleDateString()}</div>
                  {achievement.awardedByUser && (
                    <div>
                      By: {achievement.awardedByUser.firstName} {achievement.awardedByUser.lastName}
                    </div>
                  )}
                </div>
                {achievement.notes && (
                  <p className="mt-2 text-sm text-woodland-brown italic border-t border-woodland-brown pt-2">
                    {achievement.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBadges;