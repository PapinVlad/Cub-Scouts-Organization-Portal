// Helper Routes
//
// Helper Profile Operations:
// - GET /user/:userId: Retrieves helper profile by user ID
// - POST /register: Creates new helper profiles
// - GET /: Lists all helper profiles
//
// Related Data:
// - GET /events/:helperId: Fetches events associated with a helper
//
// Utility:
// - GET /test: Verifies API availability
//
// Note: Routes contain inline handlers rather than controller references.
// Authentication middleware is imported but not applied to routes.
const express = require("express")
const router = express.Router()
const helperController = require("../controllers/helperController")
const auth = require("../middleware/auth")

router.get("/test", (req, res) => {
  console.log("Helper routes test endpoint called")
  res.json({
    success: true,
    message: "Helper routes are working correctly",
    timestamp: new Date().toISOString(),
  })
})

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId

    // Check if helper exists for this user
    const helper = await helperController.getHelperByUserId(userId)

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper profile not found for this user",
      })
    }

    res.json({
      success: true,
      helper,
    })
  } catch (error) {
    console.error("Error getting helper by user ID:", error)
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    })
  }
})

router.post("/register", async (req, res) => {
  try {
    const userId = req.body.userId || (req.user ? req.user.id : null)

    if (!userId) {
      console.error("No user ID provided for helper registration")
      return res.status(400).json({
        success: false,
        message: "User ID is required for helper registration",
      })
    }

    const helperData = req.body

    const helper = await helperController.registerHelper(userId, helperData)

    res.status(201).json({
      success: true,
      message: "Helper profile created successfully",
      helper,
    })
  } catch (error) {
    console.error("Error registering helper:", error)

    if (error.message === "Helper profile already exists for this user") {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    })
  }
})

// Get all helpers
router.get("/", async (req, res) => {
  try {
    const helpers = await helperController.getAllHelpers()

    res.json({
      success: true,
      helpers,
    })
  } catch (error) {
    console.error("Error getting all helpers:", error)
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    })
  }
})

router.get("/events/:helperId", async (req, res) => {
  try {
    const helperId = req.params.helperId

    const events = await helperController.getHelperEvents(helperId)

    res.json({
      success: true,
      events,
    })
  } catch (error) {
    console.error("Error getting helper events:", error)
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    })
  }
})

module.exports = router
