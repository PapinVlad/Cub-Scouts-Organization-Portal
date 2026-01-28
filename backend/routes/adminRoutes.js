// Admin Routes
//
// Protected Routes (auth + admin middleware):
// - GET /dashboard: Retrieves admin dashboard statistics
// - GET /users: Lists all system users
// - PUT /users/role: Updates user role assignments
// - DELETE /users/:id: Removes user accounts
//
// All routes require authentication and admin privileges.
// Routes connect to corresponding adminController methods.

const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.use((req, res, next) => {
  next()
})
router.get("/dashboard", [auth, admin], adminController.getDashboardStats)

router.get("/users", [auth, admin], adminController.getAllUsers)

router.put("/users/role", [auth, admin], adminController.updateUserRole)

router.delete("/users/:id", [auth, admin], adminController.deleteUser)

module.exports = router
