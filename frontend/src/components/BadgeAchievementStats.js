"use client";

import { useState, useEffect } from "react";
import api from "../utils/api";

const BadgeAchievementStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/achievements/statistics");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Error fetching achievement statistics:", error);
        setError("Failed to load statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-md">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-background-light border border-border-light text-text-primary px-4 py-6 rounded-md text-center">
        <p className="font-medium">No achievement statistics available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-scout-blue to-scout-blue-dark p-6 text-white">
        <h3 className="text-xl font-heading font-bold mb-2">
          Badge Achievement Statistics
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold">{stats.totalCount || 0}</span>
          <span className="text-sm opacity-90">Total Badges Awarded</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div className="bg-white rounded-lg border border-border-light shadow-sm p-4">
          <h4 className="text-lg font-heading font-bold text-woodland-brown mb-3">
            Top Badges
          </h4>
          {stats.topBadges && stats.topBadges.length > 0 ? (
            <ul className="space-y-2">
              {stats.topBadges.slice(0, 5).map((item) => (
                <li
                  key={item.badge_id}
                  className="flex justify-between items-center border-b border-border-light pb-2"
                >
                  <span className="font-medium text-text-primary">
                    {item.name}
                  </span>
                  <span className="bg-accent-light text-accent-dark text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary text-center py-4">
              No badges awarded yet
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-border-light shadow-sm p-4">
          <h4 className="text-lg font-heading font-bold text-woodland-brown mb-3">
            By Category
          </h4>
          {stats.categoryCounts && stats.categoryCounts.length > 0 ? (
            <ul className="space-y-2">
              {stats.categoryCounts.map((item) => (
                <li
                  key={item.category}
                  className="flex justify-between items-center border-b border-border-light pb-2"
                >
                  <span className="font-medium text-text-primary">
                    {item.category}
                  </span>
                  <span className="bg-success/20 text-success text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary text-center py-4">
              No badges awarded yet
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border-light p-6">
        <h4 className="text-lg font-heading font-bold text-woodland-brown mb-3">
          Recent Achievements
        </h4>
        {stats.recent && stats.recent.length > 0 ? (
          <ul className="space-y-3">
            {stats.recent.map((achievement) => (
              <li
                key={achievement.id}
                className="bg-background-light rounded-md p-3"
              >
                <div className="flex flex-wrap items-center gap-1 text-sm">
                  <span className="font-semibold text-scout-blue">
                    {achievement.user.firstName} {achievement.user.lastName}
                  </span>
                  <span className="text-text-secondary">earned</span>
                  <span className="font-semibold text-forest-green">
                    {achievement.badge.name}
                  </span>
                  <span className="text-text-secondary">on</span>
                  <span className="text-text-primary">
                    {new Date(achievement.awardedDate).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary text-center py-4 bg-background-light rounded-md">
            No recent achievements
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeAchievementStats;