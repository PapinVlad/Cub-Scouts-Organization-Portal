// Event Routes
//
// Public Routes:
// - GET /: Retrieves all events with filtering options
// - GET /event-types: Lists available event categories
// - GET /:id: Fetches specific event details
//
// Authenticated Routes (auth middleware):
// - GET /helpers/:helperId: Lists events for specific helpers
// - POST /:id/volunteer: Allows helpers to offer assistance
// - POST /:id/register: Enrolls users in events
// - DELETE /:id/register: Cancels event registrations
// - GET /:id/register: Verifies registration status
//
// Admin Routes (auth + admin middleware):
// - GET /statistics: Retrieves event performance metrics
// - POST /: Creates new events
// - PUT /:id: Updates existing events
// - DELETE /:id: Removes events
// - POST /helpers: Assigns staff to events
// - DELETE /:eventId/helpers/:helperId: Removes staff assignments
// - POST /attendance: Records user check-ins
// - PUT /attendance: Records user departures
// - GET /:id/attendance: Retrieves attendance records
// - PUT /:eventId/attendance: Updates attendance records
// - POST /reminders: Creates event reminders
// - GET /:id/available-helpers: Finds available staff
// - PUT /:eventId/helpers/:helperId: Updates helper confirmation
//
// Routes connect to corresponding eventController methods.
const express = require("express")
const router = express.Router()
const eventController = require("../controllers/eventController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.get("/", eventController.getAllEvents)
router.get("/event-types", eventController.getEventTypes)
router.get("/statistics", [auth, admin], eventController.getStatistics)

router.get("/:id", eventController.getEventById)

router.post("/", [auth, admin], eventController.createEvent)

router.put("/:id", [auth, admin], eventController.updateEvent)

router.delete("/:id", [auth, admin], eventController.deleteEvent)

router.post("/helpers", [auth, admin], eventController.assignHelper)

router.delete("/:eventId/helpers/:helperId", [auth, admin], eventController.removeHelper)

router.get("/helpers/:helperId", auth, eventController.getHelperEvents)

router.post("/:id/volunteer", auth, eventController.volunteerForEvent)

router.post("/:id/register", auth, eventController.registerForEvent)

router.delete("/:id/register", auth, eventController.cancelRegistration)

router.get("/:id/register", auth, eventController.checkRegistrationStatus)

router.post("/attendance", [auth, admin], eventController.recordAttendance)

router.put("/attendance", [auth, admin], eventController.recordCheckOut)

router.get("/:id/attendance", [auth, admin], eventController.getAttendance);

router.put("/:eventId/attendance", [auth, admin], eventController.recordCheckOut);

router.post("/reminders", [auth, admin], eventController.createReminder)

router.get("/:id/available-helpers", [auth, admin], eventController.getAvailableHelpers);

router.put("/:eventId/helpers/:helperId", [auth, admin], eventController.updateHelperConfirmation);

module.exports = router
