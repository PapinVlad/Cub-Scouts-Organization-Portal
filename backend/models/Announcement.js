// Announcement Model
//
// Database Operations:
// - getActiveAnnouncements: Retrieves current announcements with role-based filtering
// - getAnnouncementById: Fetches specific announcement with creator details
// - createAnnouncement: Inserts new announcements with metadata
// - updateAnnouncement: Modifies existing announcement properties
// - deleteAnnouncement: Removes announcements from database
// - getAllAnnouncements: Lists all announcements regardless of status
//
// Features priority-based sorting, role targeting, date constraints, and pinning.
// Joins with user data to include creator information in responses.
const { pool } = require("../config/db")

class Announcement {
  static async getActiveAnnouncements(userRole = "all") {
    try {

      let query = `
        SELECT a.*, 
          CONCAT(u.first_name, ' ', u.last_name) as creator_name,
          u.username as creator_username
        FROM announcements a
        LEFT JOIN users u ON a.created_by = u.user_id
        WHERE a.is_active = TRUE
      `

      if (userRole !== "all") {
        query += ` AND (a.target_role = 'all' OR a.target_role = ?)`
      }

      query += `
        AND (a.end_date IS NULL OR a.end_date >= CURDATE())
        ORDER BY 
          a.is_pinned DESC,
          CASE a.priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'normal' THEN 3
            WHEN 'low' THEN 4
            ELSE 5
          END,
          a.created_at DESC
      `

      const [rows] = userRole !== "all" ? await pool.execute(query, [userRole]) : await pool.execute(query)

      return rows
    } catch (error) {
      console.error("Error in getActiveAnnouncements:", error)
      throw error
    }
  }

  static async getAnnouncementById(announcementId) {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.first_name, u.last_name
         FROM announcements a
         LEFT JOIN users u ON a.created_by = u.user_id
         WHERE a.announcement_id = ?`,
        [announcementId],
      )

      if (rows.length === 0) {
        return null
      }

      const row = rows[0]
      return {
        announcement_id: row.announcement_id,
        title: row.title,
        content: row.content,
        created_by: row.created_by,
        creator_name: row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : "Unknown",
        created_at: row.created_at,
        start_date: row.start_date,
        end_date: row.end_date,
        priority: row.priority,
        target_role: row.target_role,
        is_active: row.is_active === 1,
        is_pinned: row.is_pinned === 1,
        category: row.category || "general",
      }
    } catch (error) {
      console.error("Error in getAnnouncementById:", error)
      throw error
    }
  }

  static async createAnnouncement(
    title,
    content,
    createdBy,
    startDate = null,
    endDate = null,
    priority = "normal",
    targetRole = "all",
    category = "general",
    isPinned = false,
  ) {
    try {
      const [result] = await pool.query(
        `INSERT INTO announcements 
         (title, content, created_by, start_date, end_date, priority, target_role, category, is_pinned) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, content, createdBy, startDate, endDate, priority, targetRole, category, isPinned ? 1 : 0],
      )

      const announcementId = result.insertId
      return this.getAnnouncementById(announcementId)
    } catch (error) {
      console.error("Error in createAnnouncement:", error)
      throw error
    }
  }

  static async updateAnnouncement(
    announcementId,
    title,
    content,
    startDate = null,
    endDate = null,
    priority = "normal",
    targetRole = "all",
    isActive = true,
    category = "general",
    isPinned = false,
  ) {
    try {
      const [result] = await pool.query(
        `UPDATE announcements 
         SET title = ?, content = ?, start_date = ?, end_date = ?, 
             priority = ?, target_role = ?, is_active = ?, category = ?, is_pinned = ?
         WHERE announcement_id = ?`,
        [
          title,
          content,
          startDate,
          endDate,
          priority,
          targetRole,
          isActive ? 1 : 0,
          category,
          isPinned ? 1 : 0,
          announcementId,
        ],
      )

      return result.affectedRows > 0
    } catch (error) {
      console.error("Error in updateAnnouncement:", error)
      throw error
    }
  }

  static async deleteAnnouncement(announcementId) {
    try {
      const [result] = await pool.query(`DELETE FROM announcements WHERE announcement_id = ?`, [announcementId])

      return result.affectedRows > 0
    } catch (error) {
      console.error("Error in deleteAnnouncement:", error)
      throw error
    }
  }

  static async getAllAnnouncements() {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, u.first_name, u.last_name
         FROM announcements a
         LEFT JOIN users u ON a.created_by = u.user_id
         ORDER BY a.is_pinned DESC, a.created_at DESC`,
      )

      return rows.map((row) => ({
        announcement_id: row.announcement_id,
        title: row.title,
        content: row.content,
        created_by: row.created_by,
        creator_name: row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : "Unknown",
        created_at: row.created_at,
        start_date: row.start_date,
        end_date: row.end_date,
        priority: row.priority,
        target_role: row.target_role,
        is_active: row.is_active === 1,
        is_pinned: row.is_pinned === 1,
        category: row.category || "general",
      }))
    } catch (error) {
      console.error("Error in getAllAnnouncements:", error)
      throw error
    }
  }
}

module.exports = Announcement
