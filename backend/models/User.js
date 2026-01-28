// User Account Model
//
// Authentication & Registration:
// - create: Creates new users with secure password hashing
// - findByUsername: Retrieves user by username for login
// - comparePassword: Verifies password against stored hash
// - updateLastLogin: Records user login timestamps
//
// User Management:
// - findById: Fetches user details by ID with limited fields
// - getAllUsers: Lists all users with non-sensitive information
// - updateUserRole: Modifies user role with validation
// - deleteUser: Removes user accounts
//
// Handles user authentication, registration, and account management.
// Implements security best practices with bcrypt password hashing.
const { pool } = require("../config/db")
const bcrypt = require("bcryptjs")

class User {
  static async create({ username, email, password, firstName, lastName, role = "public" }) {
    try {
      const [existingUsers] = await pool.execute("SELECT * FROM users WHERE username = ? OR email = ?", [
        username,
        email,
      ])

      if (existingUsers.length > 0) {
        throw new Error("Username or email already exists")
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const [result] = await pool.execute(
        "INSERT INTO users (username, email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?, ?)",
        [username, email, hashedPassword, firstName, lastName, role],
      )

      return {
        id: result.insertId,
        username,
        email,
        firstName,
        lastName,
        role,
      }
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  static async findByUsername(username) {
    try {

      const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [username])


      if (rows.length === 0) {
        return null
      }

      return rows[0]
    } catch (error) {
      console.error("Error finding user by username:", error)
      throw error
    }
  }

  static async findById(id) {
    try {

      const [rows] = await pool.execute(
        "SELECT user_id, username, email, first_name, last_name, role, created_at, last_login FROM users WHERE user_id = ?",
        [id],
      )


      if (rows.length === 0) {
        return null
      }

      return rows[0]
    } catch (error) {
      console.error("Error finding user by ID:", error)
      throw error
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    try {

      if (!plainPassword || !hashedPassword) {
        console.error("Missing password parameters")
        return false
      }

      const isMatch = await bcrypt.compare(plainPassword, hashedPassword)

      return isMatch
    } catch (error) {
      console.error("Error comparing password:", error)
      return false
    }
  }

  static async updateLastLogin(userId) {
    try {
      await pool.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?", [userId])
      return true
    } catch (error) {
      console.error("Error updating last login:", error)
      return false
    }
  }

  static async getAllUsers() {
    try {

      const [rows] = await pool.execute(
        "SELECT user_id, username, email, first_name, last_name, role, created_at, last_login FROM users",
      )

      return rows
    } catch (error) {
      console.error("Error getting all users:", error)
      throw error
    }
  }

  static async updateUserRole(userId, role) {
    try {

      const validRoles = ["admin", "leader", "helper", "public"]
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}. Valid roles are: ${validRoles.join(", ")}`)
      }

      const [result] = await pool.execute("UPDATE users SET role = ? WHERE user_id = ?", [role, userId])

      if (result.affectedRows === 0) {
        throw new Error(`User with ID ${userId} not found`)
      }

      return true
    } catch (error) {
      console.error("Error updating user role:", error)
      throw error
    }
  }

  static async deleteUser(userId) {
    try {

      const [result] = await pool.execute("DELETE FROM users WHERE user_id = ?", [userId])

      if (result.affectedRows === 0) {
        throw new Error(`User with ID ${userId} not found`)
      }

      return true
    } catch (error) {
      console.error("Error deleting user:", error)
      throw error
    }
  }
}

module.exports = User

