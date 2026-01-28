// Badge Achievement Model
//
// Core Achievement Operations:
// - awardBadge: Grants badges to users with notifications
// - revokeBadge: Removes badges from users
// - getUserBadges: Lists all badges earned by a user
// - getBadgeUsers: Lists all users who earned a specific badge
// - updateNotes: Modifies notes for existing achievements
//
// Progress Tracking:
// - trackProgress: Records user progress toward badge requirements
// - getUserBadgeProgress: Retrieves progress for specific user/badge combinations
// - addEvidence: Uploads proof of requirement completion
// - getEvidence: Retrieves evidence records for badge progress
//
// Analytics:
// - getStatistics: Generates comprehensive badge achievement metrics
//
// Integrates with notification system for badge award alerts.
const { pool } = require("../config/db");
const Notification = require("./Notification");

class BadgeAchievement {
  static async awardBadge(userId, badgeId, awardedBy, notes = null) {
    try {
      const [userCheck] = await pool.execute(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
      );
      if (userCheck.length === 0) {
        throw new Error("User not found");
      }

      const [badgeCheck] = await pool.execute(
        "SELECT * FROM badges WHERE badge_id = ?",
        [badgeId]
      );
      if (badgeCheck.length === 0) {
        throw new Error("Badge not found");
      }

      const [existingCheck] = await pool.execute(
        "SELECT * FROM badge_achievements WHERE user_id = ? AND badge_id = ?",
        [userId, badgeId]
      );
      if (existingCheck.length > 0) {
        throw new Error("Badge already awarded to this user");
      }

      const [result] = await pool.execute(
        "INSERT INTO badge_achievements (user_id, badge_id, awarded_by, awarded_date, notes) VALUES (?, ?, ?, NOW(), ?)",
        [userId, badgeId, awardedBy, notes]
      );

      const badgeName = badgeCheck[0].name;

      await Notification.createNotification(
        userId,
        "New Badge Awarded",
        `You have been awarded the ${badgeName} badge!`,
        "badge",
        badgeId 
      );

      const [achievement] = await pool.execute(
        "SELECT * FROM badge_achievements WHERE achievement_id = ?",
        [result.insertId]
      );

      return achievement[0];
    } catch (error) {
      console.error("Error in BadgeAchievement.awardBadge:", error.message);
      throw error;
    }
  }

  static async revokeBadge(userId, badgeId) {
  try {
    const userIdAsNumber = Number(userId);
    const badgeIdAsNumber = Number(badgeId);

    const [existingAchievements] = await pool.execute(
      "SELECT * FROM badge_achievements WHERE user_id = ? AND badge_id = ?",
      [userIdAsNumber, badgeIdAsNumber]
    );

    if (existingAchievements.length === 0) {
      throw new Error("User does not have this badge");
    }

    await pool.execute(
      "DELETE FROM badge_achievements WHERE user_id = ? AND badge_id = ?",
      [userIdAsNumber, badgeIdAsNumber]
    );

    return true;
  } catch (error) {
    console.error("Error in BadgeAchievement.revokeBadge:", error);
    throw error;
  }
}

  static async getUserBadges(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT ba.*, 
                b.name AS badge_name, 
                b.category AS badge_category, 
                b.image_url AS badge_image_url,
                CONCAT(u.first_name, ' ', u.last_name) AS awarded_by_name,
                u.first_name AS awarded_by_first_name,
                u.last_name AS awarded_by_last_name
         FROM badge_achievements ba
         JOIN badges b ON ba.badge_id = b.badge_id
         LEFT JOIN users u ON ba.awarded_by = u.user_id
         WHERE ba.user_id = ?`,
        [userId]
      );

      return rows.map((row) => ({
        id: row.achievement_id,
        badgeId: row.badge_id,
        userId: row.user_id,
        awardedDate: row.awarded_date,
        notes: row.notes,
        badge: {
          id: row.badge_id,
          name: row.badge_name,
          category: row.badge_category,
          imageUrl: row.badge_image_url,
        },
        awardedByUser: row.awarded_by
          ? {
              id: row.awarded_by,
              firstName: row.awarded_by_first_name,
              lastName: row.awarded_by_last_name,
            }
          : null,
      }));
    } catch (error) {
      console.error("Error in BadgeAchievement.getUserBadges:", error.message);
      throw error;
    }
  }

  static async getBadgeUsers(badgeId) {
    try {
      const badgeIdAsNumber = Number(badgeId);
      const [rows] = await db.pool.execute(
        `SELECT ba.*, 
          b.name as badge_name, b.category as badge_category, b.description as badge_description,
          u.first_name as user_first_name, u.last_name as user_last_name, u.username as user_username, u.email as user_email,
          a.first_name as awarded_by_first_name, a.last_name as awarded_by_last_name
        FROM badge_achievements ba
        JOIN badges b ON ba.badge_id = b.badge_id
        JOIN users u ON ba.user_id = u.user_id
        LEFT JOIN users a ON ba.awarded_by = a.user_id
        WHERE ba.badge_id = ?
        ORDER BY ba.awarded_date DESC`,
        [badgeIdAsNumber]
      );

      return rows.map((row) => ({
        id: row.achievement_id,
        userId: row.user_id,
        badgeId: row.badge_id,
        awardedBy: row.awarded_by,
        awardedDate: row.awarded_date,
        notes: row.notes,
        badge: {
          id: row.badge_id,
          name: row.badge_name,
          category: row.badge_category,
          description: row.badge_description,
        },
        user: {
          id: row.user_id,
          firstName: row.user_first_name,
          lastName: row.user_last_name,
          username: row.user_username,
          email: row.user_email,
        },
        awardedByUser: row.awarded_by
          ? {
              id: row.awarded_by,
              firstName: row.awarded_by_first_name,
              lastName: row.awarded_by_last_name,
            }
          : null,
      }));
    } catch (error) {
      console.error("Error in BadgeAchievement.getBadgeUsers:", error);
      throw error;
    }
  }

  static async updateNotes(achievementId, notes) {
    try {
      const achievementIdAsNumber = Number(achievementId);
      await db.pool.execute(
        "UPDATE badge_achievements SET notes = ? WHERE achievement_id = ?",
        [notes, achievementIdAsNumber]
      );

      return true;
    } catch (error) {
      console.error("Error in BadgeAchievement.updateNotes:", error);
      throw error;
    }
  }

  static async trackProgress({ userId, badgeId, requirementId, completed, notes }) {
    try {
      const userIdAsNumber = Number(userId);
      const badgeIdAsNumber = Number(badgeId);
      const requirementIdAsNumber = Number(requirementId);

      const [existingProgress] = await db.pool.execute(
        "SELECT * FROM badge_achievement_progress WHERE user_id = ? AND badge_id = ? AND requirement_id = ?",
        [userIdAsNumber, badgeIdAsNumber, requirementIdAsNumber]
      );

      if (existingProgress.length > 0) {
        await db.pool.execute(
          "UPDATE badge_achievement_progress SET completed = ?, notes = ?, completed_date = ? WHERE progress_id = ?",
          [
            completed ? 1 : 0,
            notes || null,
            completed ? new Date() : null,
            existingProgress[0].progress_id,
          ]
        );

        const [updatedProgress] = await db.pool.execute(
          "SELECT * FROM badge_achievement_progress WHERE progress_id = ?",
          [existingProgress[0].progress_id]
        );

        return updatedProgress[0];
      } else {
        const [result] = await db.pool.execute(
          "INSERT INTO badge_achievement_progress (user_id, badge_id, requirement_id, completed, completed_date, notes) VALUES (?, ?, ?, ?, ?, ?)",
          [
            userIdAsNumber,
            badgeIdAsNumber,
            requirementIdAsNumber,
            completed ? 1 : 0,
            completed ? new Date() : null,
            notes || null,
          ]
        );

        const [newProgress] = await db.pool.execute(
          "SELECT * FROM badge_achievement_progress WHERE progress_id = ?",
          [result.insertId]
        );

        return newProgress[0];
      }
    } catch (error) {
      console.error("Error in BadgeAchievement.trackProgress:", error);
      throw error;
    }
  }

  static async getUserBadgeProgress(userId, badgeId) {
    try {
      const userIdAsNumber = Number(userId);
      const badgeIdAsNumber = Number(badgeId);
      const [rows] = await db.pool.execute(
        `SELECT bp.*, br.requirement_text as requirement_description
        FROM badge_achievement_progress bp
        JOIN badge_requirements br ON bp.requirement_id = br.requirement_id
        WHERE bp.user_id = ? AND bp.badge_id = ?
        ORDER BY bp.requirement_id`,
        [userIdAsNumber, badgeIdAsNumber]
      );

      return rows;
    } catch (error) {
      console.error("Error in BadgeAchievement.getUserBadgeProgress:", error);
      throw error;
    }
  }

  static async addEvidence({ progressId, fileUrl, fileType, uploadedBy, description }) {
    try {
      const progressIdAsNumber = Number(progressId);
      const uploadedByAsNumber = Number(uploadedBy);

      const [result] = await db.pool.execute(
        "INSERT INTO badge_achievement_evidence (progress_id, file_url, file_type, uploaded_by, upload_date, description) VALUES (?, ?, ?, ?, NOW(), ?)",
        [progressIdAsNumber, fileUrl, fileType, uploadedByAsNumber, description || null]
      );

      const [evidence] = await db.pool.execute(
        "SELECT * FROM badge_achievement_evidence WHERE evidence_id = ?",
        [result.insertId]
      );

      return evidence[0];
    } catch (error) {
      console.error("Error in BadgeAchievement.addEvidence:", error);
      throw error;
    }
  }

  static async getEvidence(progressId) {
    try {
      const progressIdAsNumber = Number(progressId);
      const [rows] = await db.pool.execute(
        `SELECT be.*, u.first_name as uploader_first_name, u.last_name as uploader_last_name
        FROM badge_achievement_evidence be
        LEFT JOIN users u ON be.uploaded_by = u.user_id
        WHERE be.progress_id = ?
        ORDER BY be.upload_date DESC`,
        [progressIdAsNumber]
      );

      return rows;
    } catch (error) {
      console.error("Error in BadgeAchievement.getEvidence:", error);
      throw error;
    }
  }

  static async getStatistics() {
  try {

    const [totalCount] = await pool.execute("SELECT COUNT(*) as count FROM badge_achievements");

    const [categoryCounts] = await pool.execute(
      `SELECT b.category, COUNT(*) as count
       FROM badge_achievements ba
       JOIN badges b ON ba.badge_id = b.badge_id
       GROUP BY b.category
       ORDER BY count DESC`
    );

    const [topBadges] = await pool.execute(
      `SELECT b.badge_id, b.name, b.category, COUNT(*) as count
       FROM badge_achievements ba
       JOIN badges b ON ba.badge_id = b.badge_id
       GROUP BY b.badge_id
       ORDER BY count DESC
       LIMIT 5`
    );

    const [topUsers] = await pool.execute(
      `SELECT u.user_id, u.first_name, u.last_name, u.username, COUNT(*) as count
       FROM badge_achievements ba
       JOIN users u ON ba.user_id = u.user_id
       GROUP BY u.user_id
       ORDER BY count DESC
       LIMIT 5`
    );

    const [recentAchievements] = await pool.execute(
      `SELECT ba.achievement_id, ba.user_id, ba.badge_id, ba.awarded_by, ba.awarded_date, ba.notes,
        b.name as badge_name, b.category as badge_category, b.description as badge_description,
        u.first_name as user_first_name, u.last_name as user_last_name, u.username as user_username
       FROM badge_achievements ba
       JOIN badges b ON ba.badge_id = b.badge_id
       JOIN users u ON ba.user_id = u.user_id
       ORDER BY ba.awarded_date DESC
       LIMIT 5`
    );

    return {
      totalCount: totalCount[0].count,
      categoryCounts,
      topBadges,
      topUsers,
      recent: recentAchievements.map((achievement) => ({
        id: achievement.achievement_id,
        userId: achievement.user_id,
        badgeId: achievement.badge_id,
        awardedBy: achievement.awarded_by,
        awardedDate: achievement.awarded_date,
        notes: achievement.notes,
        badge: {
          id: achievement.badge_id,
          name: achievement.badge_name,
          category: achievement.badge_category,
          description: achievement.badge_description,
        },
        user: {
          id: achievement.user_id,
          firstName: achievement.user_first_name,
          lastName: achievement.user_last_name,
          username: achievement.user_username,
        },
      })),
    };
  } catch (error) {
    console.error("Error in BadgeAchievement.getStatistics:", error);
    throw error;
  }
}
}

module.exports = BadgeAchievement;