// Badge Achievement Management API
//
// Core Badge Functions:
// - awardBadge: Grants badges to users with optional notes
// - revokeBadge: Removes badges from users
// - getUserBadges: Lists all badges earned by a specific user
// - getBadgeUsers: Lists all users who earned a specific badge
// - updateNotes: Modifies notes for existing badge achievements
// - getStatistics: Retrieves system-wide badge achievement metrics
//
// Progress Tracking:
// - trackProgress: Records user progress toward badge requirements
// - getUserBadgeProgress: Retrieves progress for specific user/badge combinations
// 
// Evidence Management:
// - addEvidence: Uploads and stores files as badge requirement evidence
// - getEvidence: Retrieves evidence records for badge progress
// - uploadEvidence: Handles file upload middleware (10MB limit)
const BadgeAchievement = require("../models/BadgeAchievement")
const User = require("../models/User")
const Badge = require("../models/Badge")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/evidence"

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "evidence-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, 
  },
})

exports.awardBadge = async (req, res) => {
  try {
    const { userId, badgeId, notes } = req.body;
    const awardedBy = req.user ? req.user.id : 1; 

    if (!userId || !badgeId) {
      return res.status(400).json({
        success: false,
        message: "userId and badgeId are required",
      });
    }

    const achievement = await BadgeAchievement.awardBadge(userId, badgeId, awardedBy, notes);

    res.status(201).json({
      success: true,
      message: "Badge awarded successfully",
      achievement,
    });
  } catch (error) {
    console.error("Error in badgeAchievementController.awardBadge:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while awarding badge",
    });
  }
};

exports.revokeBadge = async (req, res) => {
  try {
    const { userId, badgeId } = req.params

    await BadgeAchievement.revokeBadge(userId, badgeId)

    res.json({
      success: true,
      message: "Badge revoked successfully",
    })
  } catch (error) {
    console.error("Error revoking badge:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get all badges earned by a user
exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const badges = await BadgeAchievement.getUserBadges(userId);
    res.json({
      success: true,
      badges,
    });
  } catch (error) {
    console.error("Error in badgeAchievementController.getUserBadges:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching user badges",
    });
  }
};

// Get all users who have earned a specific badge
exports.getBadgeUsers = async (req, res) => {
  try {
    const badgeId = req.params.badgeId

    // Check if badge exists
    const badge = await Badge.getById(badgeId)
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: "Badge not found",
      })
    }

    const users = await BadgeAchievement.getBadgeUsers(badgeId)

    res.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    console.error("Error getting badge users:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Update badge achievement notes
exports.updateNotes = async (req, res) => {
  try {
    const { achievementId } = req.params
    const { notes } = req.body

    await BadgeAchievement.updateNotes(achievementId, notes)

    res.json({
      success: true,
      message: "Notes updated successfully",
    })
  } catch (error) {
    console.error("Error updating notes:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Track progress on a badge requirement
exports.trackProgress = async (req, res) => {
  try {
    const { userId, badgeId, requirementId, completed, notes } = req.body

    const progress = await BadgeAchievement.trackProgress({
      userId,
      badgeId,
      requirementId,
      completed,
      notes,
    })

    res.json({
      success: true,
      progress,
    })
  } catch (error) {
    console.error("Error tracking progress:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error tracking progress",
    })
  }
}

// Get progress for a user on a specific badge
exports.getUserBadgeProgress = async (req, res) => {
  try {
    const { userId, badgeId } = req.params

    const progress = await BadgeAchievement.getUserBadgeProgress(userId, badgeId)

    res.json({
      success: true,
      progress,
    })
  } catch (error) {
    console.error("Error getting progress:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Add evidence for badge progress
exports.addEvidence = async (req, res) => {
  try {
    const { progressId, description } = req.body

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    const fileUrl = `/uploads/evidence/${req.file.filename}`
    const fileType = path.extname(req.file.originalname).substring(1)

    const evidence = await BadgeAchievement.addEvidence({
      progressId,
      fileUrl,
      fileType,
      uploadedBy: req.user.id,
      description,
    })

    res.status(201).json({
      success: true,
      evidence,
    })
  } catch (error) {
    console.error("Error adding evidence:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error adding evidence",
    })
  }
}

// Get evidence for a progress record
exports.getEvidence = async (req, res) => {
  try {
    const { progressId } = req.params

    const evidence = await BadgeAchievement.getEvidence(progressId)

    res.json({
      success: true,
      evidence,
    })
  } catch (error) {
    console.error("Error getting evidence:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get badge achievement statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await BadgeAchievement.getStatistics();
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error getting badge statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve badge statistics",
    });
  }
};

// Middleware for handling evidence file upload
exports.uploadEvidence = upload.single("file")
