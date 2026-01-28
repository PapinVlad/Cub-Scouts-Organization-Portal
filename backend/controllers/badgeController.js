// Badge Management API
//
// Core Badge Operations:
// - getAllBadges: Retrieves all badges in the system
// - getBadgeById: Fetches a specific badge by ID
// - createBadge: Creates new badges with metadata and optional images
// - updateBadge: Modifies existing badge details and images
// - deleteBadge: Removes badges and their associated images
// - searchBadges: Finds badges matching search criteria
//
// Related Resources:
// - addBadgeResource: Attaches learning resources to badges
// - deleteBadgeResource: Removes resources from badges
// - getBadgeCategories: Lists all available badge categories
//
// Media Handling:
// - uploadBadgeImage: Processes image uploads (5MB limit, images only)
const Badge = require("../models/Badge")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Set up storage for badge images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/badges"

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "badge-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Not an image! Please upload only images."), false)
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, 
  },
  fileFilter: fileFilter,
})

// Get all badges
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.getAll()
    res.json({
      success: true,
      count: badges.length,
      badges,
    })
  } catch (error) {
    console.error("Error getting badges:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get badge by ID
exports.getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.getById(req.params.id)

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      })
    }

    res.json({
      success: true,
      badge,
    })
  } catch (error) {
    console.error("Error getting badge:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Create new badge
exports.createBadge = async (req, res) => {
  try {
    const badgeData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      difficultyLevel: req.body.difficultyLevel,
      requirements: JSON.parse(req.body.requirements || "[]"),
      activities: JSON.parse(req.body.activities || "[]"),
    }

    // If image was uploaded
    if (req.file) {
      badgeData.imageUrl = `/uploads/badges/${req.file.filename}`
    }

    const badge = await Badge.create(badgeData)

    res.status(201).json({
      success: true,
      badge,
    })
  } catch (error) {
    console.error("Error creating badge:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error creating badge",
    })
  }
}

// Update badge
exports.updateBadge = async (req, res) => {
  try {
    const badgeId = req.params.id
    const badge = await Badge.getById(badgeId)

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      })
    }

    const badgeData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      difficultyLevel: req.body.difficultyLevel,
      requirements: JSON.parse(req.body.requirements || "[]"),
      activities: JSON.parse(req.body.activities || "[]"),
    }

    // If image was uploaded
    if (req.file) {
      // Delete old image if it exists
      if (badge.imageUrl) {
        const oldImagePath = path.join(__dirname, "..", "public", badge.imageUrl)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      badgeData.imageUrl = `/uploads/badges/${req.file.filename}`
    } else {
      badgeData.imageUrl = badge.imageUrl
    }

    const updatedBadge = await Badge.update(badgeId, badgeData)

    res.json({
      success: true,
      badge: updatedBadge,
    })
  } catch (error) {
    console.error("Error updating badge:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error updating badge",
    })
  }
}

// Delete badge
exports.deleteBadge = async (req, res) => {
  try {
    const badgeId = req.params.id
    const badge = await Badge.getById(badgeId)

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      })
    }

    // Delete badge image if it exists
    if (badge.imageUrl) {
      const imagePath = path.join(__dirname, "..", "public", badge.imageUrl)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await Badge.delete(badgeId)

    res.json({
      success: true,
      message: "Badge deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting badge:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Add resource to badge
exports.addBadgeResource = async (req, res) => {
  try {
    const badgeId = req.params.id
    const badge = await Badge.getById(badgeId)

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      })
    }

    const resourceData = {
      title: req.body.title,
      url: req.body.url,
      type: req.body.type,
    }

    const resource = await Badge.addResource(badgeId, resourceData)

    res.status(201).json({
      success: true,
      resource,
    })
  } catch (error) {
    console.error("Error adding badge resource:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error adding badge resource",
    })
  }
}

// Delete badge resource
exports.deleteBadgeResource = async (req, res) => {
  try {
    await Badge.deleteResource(req.params.resourceId)

    res.json({
      success: true,
      message: "Resource deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting badge resource:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get badge categories
exports.getBadgeCategories = async (req, res) => {
  try {
    const categories = await Badge.getCategories()

    res.json({
      success: true,
      categories,
    })
  } catch (error) {
    console.error("Error getting badge categories:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Search badges
exports.searchBadges = async (req, res) => {
  try {
    const query = req.query.q

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const badges = await Badge.search(query)

    res.json({
      success: true,
      count: badges.length,
      badges,
    })
  } catch (error) {
    console.error("Error searching badges:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Middleware for handling badge image upload
exports.uploadBadgeImage = upload.single("image")
