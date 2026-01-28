// User Management Routes
//
// All routes protected by auth middleware
//
// User Operations:
// - GET /: Retrieves all users (likely with permission checks)
// - GET /:id: Fetches specific user details
// - PUT /:id: Updates user information
// - DELETE /:id: Removes user accounts
//
// Routes connect to corresponding authController methods.
// Note: Uses authController rather than a dedicated userController.
const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const auth = require("../middleware/auth")

router.get("/", auth, authController.getUsers)

router.get("/:id", auth, authController.getUserById)

router.put("/:id", auth, authController.updateUser)

router.delete("/:id", auth, authController.deleteUser)

module.exports = router