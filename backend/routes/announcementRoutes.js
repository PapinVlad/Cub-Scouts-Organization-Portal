// Announcement Routes
//
// Public Routes:
// - GET /: Retrieves active announcements
// - GET /:id: Fetches specific announcement by ID
//
// Protected Routes (auth + admin middleware):
// - POST /: Creates new announcements
// - PUT /:id: Updates existing announcements
// - DELETE /:id: Removes announcements
// - GET /admin/all: Lists all announcements including inactive
//
// Routes connect to corresponding announcementController methods.
const express = require("express")
const router = express.Router()
const announcementController = require("../controllers/announcementController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.use((req, res, next) => {
  next()
})

router.get("/", (req, res) => {
  return announcementController.getActiveAnnouncements(req, res)
})

router.get("/:id", (req, res) => {
  return announcementController.getAnnouncement(req, res)
})

router.post("/", [auth, admin], announcementController.createAnnouncement)

router.put("/:id", [auth, admin], announcementController.updateAnnouncement)

router.delete("/:id", [auth, admin], announcementController.deleteAnnouncement)

router.get("/admin/all", [auth, admin], announcementController.getAllAnnouncements)

module.exports = router
