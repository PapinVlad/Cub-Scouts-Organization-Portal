
// Admin API for user and badge management
//
// Endpoints:
// - getDashboardStats: Returns user counts by role and badge stats by category
// - getAllUsers: Returns simplified list of all users with essential fields
// - updateUserRole: Updates a user's role by ID
// - deleteUser: Removes a user by ID
//
// Each endpoint includes validation and appropriate error handling.
const User = require("../models/User")
const Badge = require("../models/Badge")

// Get admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {

    // Get user counts
    const users = await User.getAllUsers()

    const userStats = {
      total: users.length,
      leaders: users.filter((user) => user.role === "leader").length,
      helpers: users.filter((user) => user.role === "helper").length,
      public: users.filter((user) => user.role === "public").length,
      admin: users.filter((user) => user.role === "admin").length,
    }


    // Get badge counts
    const badges = await Badge.getAll()
    const categories = await Badge.getCategories()

    const badgeStats = {
      total: badges.length,
      categories: categories.length,
      byCategory: {},
    }

    // Count badges by category
    categories.forEach((category) => {
      badgeStats.byCategory[category] = badges.filter((badge) => badge.category === category).length
    })


    res.json({
      success: true,
      stats: {
        users: userStats,
        badges: badgeStats,
      },
    })
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();

    const mappedUsers = users.map((user) => {
      const userId = Number(user.user_id); 
      if (isNaN(userId)) {
        console.warn(`Invalid user_id for user: ${user.username}`);
        return null;
      }
      return {
        id: userId,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        email: user.email,
        createdAt: user.created_at,
        lastLogin: user.last_login,
      };
    }).filter((user) => user !== null); 


    res.json({
      success: true,
      count: mappedUsers.length,
      users: mappedUsers,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "User ID and role are required",
      })
    }

    // Check if user exists
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update user role
    await User.updateUserRole(userId, role)

    res.json({
      success: true,
      message: "User role updated successfully",
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error updating user role",
    })
  }
}

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    // Check if user exists
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Delete user
    await User.deleteUser(userId)

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting user",
    })
  }
}
