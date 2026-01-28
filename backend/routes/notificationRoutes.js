// Notification Routes
//
// All routes protected by auth middleware (applied globally)
//
// User Notification Operations:
// - GET /: Retrieves user's notifications with pagination
// - GET /unread/count: Returns number of unread notifications
// - PUT /:id/read: Updates single notification to read status
// - PUT /read/all: Updates all user notifications to read status
// - DELETE /:id: Removes specific notifications
//
// Routes connect to corresponding notificationController methods.
// Authentication ensures users can only access their own notifications.
const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notificationController")
const auth = require("../middleware/auth")

router.use(auth)


router.get("/", notificationController.getUserNotifications)


router.get("/unread/count", notificationController.getUnreadCount)


router.put("/:id/read", notificationController.markAsRead)


router.put("/read/all", notificationController.markAllAsRead)


router.delete("/:id", notificationController.deleteNotification)

module.exports = router
