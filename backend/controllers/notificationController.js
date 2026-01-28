// User Notification API
//
// Core Functions:
// - getUserNotifications: Retrieves paginated notifications for current user
// - getUnreadCount: Returns number of unread notifications
// - markAsRead: Updates single notification to read status
// - markAllAsRead: Updates all user notifications to read status
// - deleteNotification: Removes specific notifications
//
// All endpoints restricted to authenticated user's own notifications.
const Notification = require("../models/Notification")

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Number.parseInt(req.query.limit) || 20;
    const offset = Number.parseInt(req.query.offset) || 0;

    const notifications = await Notification.getUserNotifications(userId, limit, offset);

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
    });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await Notification.getUnreadCount(userId);

    res.json({
      success: true,
      count: count.count, 
    });
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching unread count",
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id
    const notificationId = req.params.id

    const marked = await Notification.markAsRead(notificationId, userId)

    if (!marked) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or you don't have permission",
      })
    }

    res.json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Error in markAsRead:", error)
    res.status(500).json({
      success: false,
      message: "Server error while marking notification as read",
    })
  }
}

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id
    const count = await Notification.markAllAsRead(userId)

    res.json({
      success: true,
      message: `${count} notifications marked as read`,
    })
  } catch (error) {
    console.error("Error in markAllAsRead:", error)
    res.status(500).json({
      success: false,
      message: "Server error while marking notifications as read",
    })
  }
}

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id
    const notificationId = req.params.id

    const deleted = await Notification.deleteNotification(notificationId, userId)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or you don't have permission",
      })
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Error in deleteNotification:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting notification",
    })
  }
}
