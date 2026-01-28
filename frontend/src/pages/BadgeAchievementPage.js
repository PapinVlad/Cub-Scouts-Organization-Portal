
// Badge Achievement Management Page
//
// Core Functionality:
// - Allows admins/leaders to award and revoke badges for users
// - Displays user's earned badges with award dates and categories
// - Provides user selection interface with filtered user list
// - Integrates badge award form for adding new achievements
// - Shows achievement statistics through dedicated component
//
// Security & Permissions:
// - Restricts access to authenticated admin and leader roles
// - Redirects unauthorized users to login or home page
// - Confirms destructive actions with confirmation dialogs
//
// State Management:
// - Handles loading states with spinner animation
// - Manages error states with user-friendly messages
// - Implements refresh mechanism after badge operations
// - Maintains selected user context across operations
//
// Features:
// - Responsive grid layout for different screen sizes
// - Scroll animations for content reveal
// - Scrollable badge list with hover effects
// - Visual categorization of badges
//
// Uses Tailwind CSS with custom color scheme (woodland-brown, forest-green).
// Client-side rendered with "use client" directive."use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";
import BadgeAwardForm from "../components/BadgeAwardForm";
import BadgeAchievementStats from "../components/BadgeAchievementStats";
import api from "../utils/api";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ScrollToTopButton from "../components/ScrollToTopButton";

const BadgeAchievementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  useScrollAnimation(loading);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const userRole = getUserRole();
    if (userRole !== "admin" && userRole !== "leader") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        const filteredUsers = response.data.users.filter(
          (user) => user.role !== "admin" && user.role !== "leader"
        );
        setUsers(filteredUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!selectedUser) {
        setUserBadges([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/achievements/user/${selectedUser}`);
        setUserBadges(response.data.badges);
      } catch (error) {
        console.error("Error fetching user badges:", error);
        setError("Failed to load user badges. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBadges();
  }, [selectedUser, refreshTrigger]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleAwardSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRevokeBadge = async (badgeId) => {
    if (!window.confirm("Are you sure you want to revoke this badge?")) {
      return;
    }

    try {
      await api.delete(`/achievements/${selectedUser}/${badgeId}`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error revoking badge:", error);
      setError("Failed to revoke badge. Please try again.");
    }
  };

  const selectedUserData =
    selectedUser && users && users.length > 0
      ? users.find((user) => user && user.id && user.id.toString() === selectedUser.toString())
      : null;

  return (
    <div className="bg-background-beige min-h-screen animate-on-scroll opacity-0 transition-all duration-700 translate-y-8">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-heading font-bold text-woodland-brown mb-8 text-center">
          Badge Achievement Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BadgeAwardForm onAwardSuccess={handleAwardSuccess} />

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-heading font-bold text-woodland-brown mb-4">
                Manage User Badges
              </h3>

              <div className="mb-4">
                <label
                  htmlFor="user-select"
                  className="block text-sm font-medium text-text-primary mb-1"
                >
                  Select User
                </label>
                <select
                  id="user-select"
                  value={selectedUser}
                  onChange={handleUserChange}
                  className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-colors duration-200"
                >
                  <option value="" key="default-user-select">
                    -- Select a user --
                  </option>
                  {users &&
                    users.map((user) => (
                      <option key={`user-select-${user.id}`} value={user.id}>
                        {user.firstName} {user.lastName} ({user.username})
                      </option>
                    ))}
                </select>
              </div>

              {selectedUser && (
                <div className="mt-6">
                  <h4 className="text-lg font-heading font-medium text-text-primary mb-3">
                    Badges for{" "}
                    <span className="font-bold">
                      {selectedUserData
                        ? `${selectedUserData.firstName} ${selectedUserData.lastName}`
                        : "Selected User"}
                    </span>
                  </h4>

                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest-green"></div>
                    </div>
                  ) : userBadges.length === 0 ? (
                    <p className="text-text-secondary italic py-4">
                      This user hasn't earned any badges yet.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {userBadges.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex justify-between items-center p-3 bg-background-light border border-border-light rounded-md hover:bg-background-beige transition-colors duration-200"
                        >
                          <div className="badge-info">
                            <h5 className="font-medium text-text-primary">
                              {achievement.badge.name}
                            </h5>
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-accent-light text-accent-dark rounded-full mt-1">
                              {achievement.badge.category}
                            </span>
                            <div className="text-sm text-text-secondary mt-1">
                              Awarded:{" "}
                              {new Date(achievement.awardedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRevokeBadge(achievement.badgeId)}
                            className="px-3 py-1 bg-error/10 hover:bg-error/20 text-error text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error"
                          >
                            Revoke
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <BadgeAchievementStats />
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-error/10 border-l-4 border-error text-error">
            <p>{error}</p>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default BadgeAchievementPage;