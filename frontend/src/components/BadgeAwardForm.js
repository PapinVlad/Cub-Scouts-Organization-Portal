"use client";

import { useState, useEffect } from "react";
import api from "../utils/api";

const BadgeAwardForm = ({ onAwardSuccess }) => {
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, badgesResponse] = await Promise.all([
          api.get("/admin/users"),
          api.get("/badges"),
        ]);

        const filteredUsers = usersResponse.data.users.filter(
          (user) => user.role !== "admin" && user.role !== "leader"
        );

        if (filteredUsers.length === 0) {
          setError("No eligible users found (excluding admins and leaders).");
        } else {
          const validUsers = filteredUsers.filter(
            (user) => user.id != null && !isNaN(Number(user.id))
          );
          if (validUsers.length !== filteredUsers.length) {
            console.warn("Some users have invalid IDs:", filteredUsers);
          }
          setUsers(validUsers);
        }
        setBadges(badgesResponse.data.badges);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load users and badges. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedBadge) {
      setError("Please select both a user and a badge");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      
      const userIdAsNumber = Number(selectedUser);
      if (isNaN(userIdAsNumber)) {
        throw new Error("Invalid user ID");
      }
      const response = await api.post("/achievements", {
        userId: userIdAsNumber,
        badgeId: selectedBadge,
        notes,
      });

      setSuccess(true);
      setSelectedUser("");
      setSelectedBadge("");
      setNotes("");

      if (onAwardSuccess) {
        onAwardSuccess();
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error awarding badge:", error);
      setError(
        error.response?.data?.message || "Failed to award badge. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-forest-green"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-heading font-bold text-woodland-brown mb-4">
        Award Badge
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-error/10 text-error rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-success/10 text-success rounded-md text-sm">
          Badge awarded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="user"
            className="block text-sm font-medium text-text-primary"
          >
            Select User
          </label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
            disabled={users.length === 0}
            className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-colors duration-200 disabled:bg-background-light disabled:cursor-not-allowed"
          >
            <option value="" key="default-user">
              -- Select a user --
            </option>
            {users.length === 0 && (
              <option value="" disabled>
                No eligible users found
              </option>
            )}
            {users.map((user) => (
              <option key={`user-${user.id}`} value={user.id}>
                {user.firstName} {user.lastName} ({user.username}) - ID: {user.id}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="badge"
            className="block text-sm font-medium text-text-primary"
          >
            Select Badge
          </label>
          <select
            id="badge"
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            required
            className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-colors duration-200"
          >
            <option value="" key="default-badge">
              -- Select a badge --
            </option>
            {badges &&
              badges.map((badge) => (
                <option key={`badge-${badge.id}`} value={badge.id}>
                  {badge.name} ({badge.category})
                </option>
              ))}
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-text-primary"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Add any notes about how the badge was earned"
            className="w-full px-3 py-2 border border-border-light rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green transition-colors duration-200 resize-vertical"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-forest-green hover:bg-primary-dark text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 disabled:bg-border-medium disabled:cursor-not-allowed"
        >
          {submitting ? "Awarding..." : "Award Badge"}
        </button>
      </form>
    </div>
  );
};

export default BadgeAwardForm;