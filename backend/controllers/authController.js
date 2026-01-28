// User Authentication & Profile Management API
//
// Endpoints:
// - checkDbConnection: Verifies database connectivity
// - register: Creates new user accounts with validation
// - login: Authenticates users and issues JWT tokens
// - getCurrentUser: Retrieves authenticated user's profile
// - updateUser: Modifies user profile with permission checks
// - getUsers: Lists all users (admin only)
// - getUserById: Retrieves specific user details with permission checks
// - deleteUser: Removes user accounts (admin only)
//
// Features role-based access control and input validation for all operations.
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { pool } = require("../config/db")
const bcrypt = require("bcryptjs")

const JWT_SECRET = "obanshire_cubs_secret_key"

const checkDbConnection = async () => {
  try {
    const connection = await pool.getConnection()
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection error in controller:", error.message)
    return false
  }
}

exports.register = async (req, res) => {
  try {
    const dbConnected = await checkDbConnection()
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    }

    const { username, email, password, firstName, lastName, role } = req.body

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      })
    }

    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || "public", 
    })

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, 
      },
      JWT_SECRET,
    )

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Server error during registration",
    })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const dbConnected = await checkDbConnection()
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    }

    const { username, password } = req.body


    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      })
    }

    // Check if user exists
    const user = await User.findByUsername(username)


    if (!user) {
      console.log("User not found for username:", username)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }


    const hashedPassword = user.password

    if (!hashedPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials (no password)",
      })
    }

    const isMatch = await bcrypt.compare(password, hashedPassword)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    await User.updateLastLogin(user.user_id)

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day expiration
      },
      JWT_SECRET,
    )


    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during login",
    })
  }
}

exports.getCurrentUser = async (req, res) => {
  try {
    const dbConnected = await checkDbConnection();
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      });
    }


    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name, 
        lastName: user.last_name,  
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, firstName, lastName } = req.body;

    const currentUser = req.user;
    if (currentUser.id !== Number(userId) && currentUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the user or admin can update this profile.",
      });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND user_id != ?",
      [username, email, userId]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    await pool.execute(
      "UPDATE users SET username = ?, email = ?, first_name = ?, last_name = ? WHERE user_id = ?",
      [username, email, firstName, lastName, userId]
    );

    const updatedUser = await User.findById(userId);
    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const dbConnected = await checkDbConnection()
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const users = await User.getAllUsers();
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const dbConnected = await checkDbConnection()
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    }

    const userId = req.params.id;

    if (req.user.id !== Number(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own profile or must be an admin.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Check database connection
    const dbConnected = await checkDbConnection()
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        message: "Database connection error. Please try again later.",
      })
    }

    const userId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    if (req.user.id === Number(userId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await User.deleteUser(userId);
    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};