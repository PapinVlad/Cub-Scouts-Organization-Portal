// Notification Management Model
//
// Retrieval Operations:
// - getUserNotifications: Fetches paginated notifications for a user
// - getUnreadCount: Returns number of unread notifications
//
// Status Management:
// - markAsRead: Updates single notification to read status
// - markAllAsRead: Updates all user notifications to read status
// - deleteNotification: Removes specific notifications
//
// Creation:
// - createNotification: Generates new notifications with type and reference data
//
// Handles in-app notification storage and status tracking with user-specific access control.
const { pool } = require("../config/db");

class Notification {
  // Get notifications for a user
  static async getUserNotifications(userId, limit = 20, offset = 0) {
    try {
      const [rows] = await pool.execute(
        `SELECT notification_id AS id, user_id, title, content AS message, 
                notification_type AS type, reference_id AS relatedId, is_read AS isRead, 
                created_at AS createdAt, read_at AS readAt
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?`,
        [userId, limit, offset]
      );
      return rows;
    } catch (error) {
      console.error("Error in getUserNotifications:", error);
      throw error;
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT COUNT(*) AS count FROM notifications
        WHERE user_id = ? AND is_read = FALSE`,
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error("Error in getUnreadCount:", error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const [result] = await pool.execute(
        `UPDATE notifications
        SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
        WHERE notification_id = ? AND user_id = ?`,
        [notificationId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in markAsRead:", error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      const [result] = await pool.execute(
        `UPDATE notifications
        SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND is_read = FALSE`,
        [userId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error in markAllAsRead:", error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId, userId) {
    try {
      const [result] = await pool.execute(
        `DELETE FROM notifications
        WHERE notification_id = ? AND user_id = ?`,
        [notificationId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in deleteNotification:", error);
      throw error;
    }
  }

  // Create a notification
  static async createNotification(userId, title, content, notificationType, referenceId = null) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO notifications
        (user_id, title, content, notification_type, reference_id)
        VALUES (?, ?, ?, ?, ?)`,
        [userId, title, content, notificationType, referenceId]
      );
      return {
        id: result.insertId,
        userId,
        title,
        message: content,
        type: notificationType,
        relatedId: referenceId,
      };
    } catch (error) {
      console.error("Error in Notification.createNotification:", error.message);
      throw error;
    }
  }
}

module.exports = Notification;