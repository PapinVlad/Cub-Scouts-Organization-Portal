// Authentication Routes
//
// Public Routes:
// - POST /register: Creates new user accounts
// - POST /login: Authenticates users and issues tokens
//
// Protected Routes (auth middleware):
// - GET /user: Retrieves current authenticated user's profile
//
// Routes connect to corresponding authController methods.
const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const auth = require("../middleware/auth")

router.post("/register", authController.register)

router.post("/login", authController.login)

router.get("/user", auth, authController.getCurrentUser)

module.exports = router
