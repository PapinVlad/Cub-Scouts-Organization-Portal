// Badge Routes
//
// Public Routes:
// - GET /: Retrieves all badges
// - GET /categories: Lists available badge categories
// - GET /search: Finds badges matching search criteria
// - GET /:id: Fetches specific badge details
//
// Protected Routes (auth + admin middleware):
// - POST /: Creates new badges with image upload
// - PUT /:id: Updates existing badges with image upload
// - DELETE /:id: Removes badges
// - POST /:id/resources: Adds learning resources to badges
// - DELETE /resources/:resourceId: Removes resources from badges
//
// Routes connect to corresponding badgeController methods.
const express = require("express")
const router = express.Router()
const badgeController = require("../controllers/badgeController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.get("/", badgeController.getAllBadges)

router.get("/categories", badgeController.getBadgeCategories)

router.get("/search", badgeController.searchBadges)

router.get("/:id", badgeController.getBadgeById)
router.post("/", [auth, admin, badgeController.uploadBadgeImage], badgeController.createBadge)

router.put("/:id", [auth, admin, badgeController.uploadBadgeImage], badgeController.updateBadge)

router.delete("/:id", [auth, admin], badgeController.deleteBadge)

router.post("/:id/resources", [auth, admin], badgeController.addBadgeResource)

router.delete("/resources/:resourceId", [auth, admin], badgeController.deleteBadgeResource)

module.exports = router
