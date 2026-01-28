// Photo Tag Routes
//
// Public Routes:
// - GET /categories: Retrieves all tag categories with their tags
// - GET /tags: Lists all available tags across categories
// - GET /direct-categories: Fetches category list without associated tags
// - GET /direct-tags/:categoryId: Gets tags for a specific category
//
// Protected Routes (auth + admin middleware):
// - POST /categories: Creates new tag categories
// - POST /tags: Adds new tags to categories
// - DELETE /tags/:tagId: Removes specific tags
// - DELETE /categories/:categoryId: Deletes categories and their tags
//
// Routes connect to corresponding photoTagController methods.
// Separates read operations (public) from write operations (admin only).
const express = require("express")
const router = express.Router()
const photoTagController = require("../controllers/photoTagController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

router.get("/categories", photoTagController.getAllTagCategories)
router.get("/tags", photoTagController.getAllTags)

router.get("/direct-categories", photoTagController.getDirectCategories)
router.get("/direct-tags/:categoryId", photoTagController.getDirectTags)

router.post("/categories", [auth, admin], photoTagController.addTagCategory)
router.post("/tags", [auth, admin], photoTagController.addTag)
router.delete("/tags/:tagId", [auth, admin], photoTagController.deleteTag)
router.delete("/categories/:categoryId", [auth, admin], photoTagController.deleteTagCategory)

module.exports = router
