// Badge Model
//
// Core Badge Operations:
// - create: Creates badges with requirements and activities
// - getAll: Retrieves all badges with basic information
// - getById: Fetches complete badge details with related data
// - update: Modifies badges and their associated content
// - delete: Removes badges and all related records
// - search: Finds badges matching search criteria
//
// Resource Management:
// - addResource: Attaches learning materials to badges
// - deleteResource: Removes resources from badges
// - getCategories: Lists all distinct badge categories
//
// Handles relationships between badges and their requirements, activities, and resources.
const { pool } = require("../config/db")

class Badge {
  static async create(badgeData) {
    const { name, category, description, imageUrl, difficultyLevel } = badgeData

    if (!name || !category) {
      throw new Error("Name and category are required")
    }

    try {
      const [result] = await pool.execute(
        "INSERT INTO badges (name, category, description, image_url, difficulty_level) VALUES (?, ?, ?, ?, ?)",
        [name, category, description || "", imageUrl || "", difficultyLevel || 1],
      )

      const badgeId = result.insertId

      // If requirements are provided, add them
      if (badgeData.requirements && Array.isArray(badgeData.requirements)) {
        for (const requirement of badgeData.requirements) {
          await pool.execute("INSERT INTO badge_requirements (badge_id, requirement_text) VALUES (?, ?)", [
            badgeId,
            requirement,
          ])
        }
      }

      // If activities are provided, add them
      if (badgeData.activities && Array.isArray(badgeData.activities)) {
        for (const activity of badgeData.activities) {
          await pool.execute("INSERT INTO badge_activities (badge_id, activity_text) VALUES (?, ?)", [
            badgeId,
            activity,
          ])
        }
      }

      return {
        id: badgeId,
        ...badgeData,
      }
    } catch (error) {
      console.error("Error creating badge:", error)
      throw error
    }
  }

  static async getAll() {
    try {
      const [badges] = await pool.execute("SELECT * FROM badges ORDER BY name ASC")

      return badges.map((badge) => ({
        id: badge.badge_id,
        name: badge.name,
        category: badge.category,
        description: badge.description,
        imageUrl: badge.image_url,
        difficultyLevel: badge.difficulty_level,
        createdAt: badge.created_at,
      }))
    } catch (error) {
      console.error("Error getting all badges:", error)
      throw error
    }
  }

  static async getById(badgeId) {
    try {
      const [badges] = await pool.execute("SELECT * FROM badges WHERE badge_id = ?", [badgeId])

      if (badges.length === 0) {
        return null
      }

      const badge = badges[0]

      const [requirements] = await pool.execute(
        "SELECT requirement_text FROM badge_requirements WHERE badge_id = ? ORDER BY requirement_id ASC",
        [badgeId],
      )

      const [activities] = await pool.execute(
        "SELECT activity_text FROM badge_activities WHERE badge_id = ? ORDER BY activity_id ASC",
        [badgeId],
      )

      const [resources] = await pool.execute(
        "SELECT * FROM badge_resources WHERE badge_id = ? ORDER BY resource_id ASC",
        [badgeId],
      )

      return {
        id: badge.badge_id,
        name: badge.name,
        category: badge.category,
        description: badge.description,
        imageUrl: badge.image_url,
        difficultyLevel: badge.difficulty_level,
        createdAt: badge.created_at,
        requirements: requirements.map((r) => r.requirement_text),
        activities: activities.map((a) => a.activity_text),
        resources: resources.map((r) => ({
          id: r.resource_id,
          title: r.title,
          url: r.url,
          type: r.resource_type,
        })),
      }
    } catch (error) {
      console.error("Error getting badge by ID:", error)
      throw error
    }
  }

  static async update(badgeId, badgeData) {
    const { name, category, description, imageUrl, difficultyLevel } = badgeData

    if (!name || !category) {
      throw new Error("Name and category are required")
    }

    try {
      await pool.execute(
        "UPDATE badges SET name = ?, category = ?, description = ?, image_url = ?, difficulty_level = ? WHERE badge_id = ?",
        [name, category, description || "", imageUrl || "", difficultyLevel || 1, badgeId],
      )

      if (badgeData.requirements && Array.isArray(badgeData.requirements)) {
        await pool.execute("DELETE FROM badge_requirements WHERE badge_id = ?", [badgeId])

        for (const requirement of badgeData.requirements) {
          await pool.execute("INSERT INTO badge_requirements (badge_id, requirement_text) VALUES (?, ?)", [
            badgeId,
            requirement,
          ])
        }
      }

      if (badgeData.activities && Array.isArray(badgeData.activities)) {
        await pool.execute("DELETE FROM badge_activities WHERE badge_id = ?", [badgeId])

        for (const activity of badgeData.activities) {
          await pool.execute("INSERT INTO badge_activities (badge_id, activity_text) VALUES (?, ?)", [
            badgeId,
            activity,
          ])
        }
      }

      return {
        id: badgeId,
        ...badgeData,
      }
    } catch (error) {
      console.error("Error updating badge:", error)
      throw error
    }
  }

  static async delete(badgeId) {
    try {
      await pool.execute("DELETE FROM badge_resources WHERE badge_id = ?", [badgeId])

      await pool.execute("DELETE FROM badge_requirements WHERE badge_id = ?", [badgeId])

      await pool.execute("DELETE FROM badge_activities WHERE badge_id = ?", [badgeId])

      await pool.execute("DELETE FROM badges WHERE badge_id = ?", [badgeId])

      return true
    } catch (error) {
      console.error("Error deleting badge:", error)
      throw error
    }
  }

  static async addResource(badgeId, resourceData) {
    const { title, url, type } = resourceData

    if (!title || !url || !type) {
      throw new Error("Title, URL, and type are required")
    }

    try {
      const [result] = await pool.execute(
        "INSERT INTO badge_resources (badge_id, title, url, resource_type) VALUES (?, ?, ?, ?)",
        [badgeId, title, url, type],
      )

      return {
        id: result.insertId,
        ...resourceData,
      }
    } catch (error) {
      console.error("Error adding badge resource:", error)
      throw error
    }
  }

  static async deleteResource(resourceId) {
    try {
      await pool.execute("DELETE FROM badge_resources WHERE resource_id = ?", [resourceId])

      return true
    } catch (error) {
      console.error("Error deleting badge resource:", error)
      throw error
    }
  }

  static async getCategories() {
    try {
      const [categories] = await pool.execute("SELECT DISTINCT category FROM badges ORDER BY category ASC")

      return categories.map((c) => c.category)
    } catch (error) {
      console.error("Error getting badge categories:", error)
      throw error
    }
  }

  static async search(query) {
    try {
      const searchTerm = `%${query}%`
      const [badges] = await pool.execute(
        "SELECT * FROM badges WHERE name LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY name ASC",
        [searchTerm, searchTerm, searchTerm],
      )

      return badges.map((badge) => ({
        id: badge.badge_id,
        name: badge.name,
        category: badge.category,
        description: badge.description,
        imageUrl: badge.image_url,
        difficultyLevel: badge.difficulty_level,
        createdAt: badge.created_at,
      }))
    } catch (error) {
      console.error("Error searching badges:", error)
      throw error
    }
  }
}

module.exports = Badge
