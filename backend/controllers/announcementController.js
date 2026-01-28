// Announcement Management API
//
// Endpoints:
// - getActiveAnnouncements: Returns announcements filtered by user role
// - getAnnouncement: Retrieves a specific announcement with role-based access control
// - createAnnouncement: Creates a new announcement with targeting options
// - updateAnnouncement: Modifies an existing announcement's details
// - deleteAnnouncement: Removes an announcement by ID
// - getAllAnnouncements: Lists all announcements regardless of status
//
// Announcements include title, content, date range, priority, and role targeting.
const Announcement = require("../models/Announcement")


exports.getActiveAnnouncements = async (req, res) => {
  try {

    const userRole = req.user ? req.user.role : "all"

    const announcements = await Announcement.getActiveAnnouncements(userRole)

    res.json({
      success: true,
      announcements,
    })
  } catch (error) {
    console.error("Error in getActiveAnnouncements:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}


exports.getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params

    const userRole = req.user ? req.user.role : "all"

    const announcement = await Announcement.getAnnouncementById(id)

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      })
    }

    if (announcement.target_role !== "all" && announcement.target_role !== userRole) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this announcement",
      })
    }

    res.json({
      success: true,
      announcement,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, startDate, endDate, priority, targetRole } = req.body
    const createdBy = req.user.id

    const announcement = await Announcement.createAnnouncement(
      title,
      content,
      createdBy,
      startDate,
      endDate,
      priority,
      targetRole,
    )

    res.status(201).json({
      success: true,
      announcement,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, startDate, endDate, priority, targetRole, isActive } = req.body

    const announcement = await Announcement.updateAnnouncement(
      id,
      title,
      content,
      startDate,
      endDate,
      priority,
      targetRole,
      isActive,
    )

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      })
    }

    res.json({
      success: true,
      announcement,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params

    const result = await Announcement.deleteAnnouncement(id)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      })
    }

    res.json({
      success: true,
      message: "Announcement deleted",
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.getAllAnnouncements()

    res.json({
      success: true,
      announcements,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}
