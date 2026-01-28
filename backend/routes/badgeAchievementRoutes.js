// Badge Achievement Routes
//
// Achievement Management:
// - POST /: Awards badges to users
// - DELETE /:userId/:badgeId: Revokes badges from users
// - PUT /:achievementId/notes: Updates achievement notes
// - GET /statistics: Retrieves badge achievement metrics
//
// User & Badge Queries:
// - GET /user/:userId: Lists badges earned by a specific user
// - GET /badge/:badgeId: Lists users who earned a specific badge
//
// Progress Tracking:
// - POST /progress: Records progress toward badge requirements
// - GET /progress/:userId/:badgeId: Fetches user progress on specific badges
//
// Evidence Handling:
// - POST /evidence: Uploads and stores requirement evidence files
// - GET /evidence/:progressId: Retrieves evidence for badge progress
//
// Utility:
// - GET /test: Verifies API availability
//
// Note: Most routes lack authentication middleware.

const express = require("express")
const router = express.Router()
const badgeAchievementController = require("../controllers/badgeAchievementController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.use((req, res, next) => {
  next()
})

router.post("/", badgeAchievementController.awardBadge) 

router.delete("/:userId/:badgeId", badgeAchievementController.revokeBadge) 

router.get("/user/:userId", badgeAchievementController.getUserBadges)

router.get("/badge/:badgeId", badgeAchievementController.getBadgeUsers) 

router.put("/:achievementId/notes", badgeAchievementController.updateNotes) 

router.post("/progress", badgeAchievementController.trackProgress) 

router.get("/progress/:userId/:badgeId", badgeAchievementController.getUserBadgeProgress) 

router.post("/evidence", [badgeAchievementController.uploadEvidence], badgeAchievementController.addEvidence) 

router.get("/evidence/:progressId", badgeAchievementController.getEvidence) 

router.get("/statistics", badgeAchievementController.getStatistics) 

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Badge Achievement API is working correctly",
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
