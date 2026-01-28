// Photo Tag Management Model
//
// Tag Operations:
// - getAllTags: Retrieves all predefined tags with category information
// - getTagsByCategory: Fetches tags for a specific category
// - validateTags: Verifies tags exist in the predefined set
// - addTag: Creates new predefined tags within categories
// - deleteTag: Removes tags from the predefined set
//
// Category Operations:
// - getAllCategories: Lists all available tag categories
//
// Manages the predefined tag vocabulary for photo organization and filtering.
// Provides validation to ensure only approved tags are used.
const db = require("../config/db")

class PhotoTag {
  static async getAllTags() {
    try {
      const [tags] = await db.query(`
        SELECT pt.tag_id, pt.tag, pt.category_id, ptc.name as category_name
        FROM predefined_photo_tags pt
        LEFT JOIN photo_tag_categories ptc ON pt.category_id = ptc.category_id
        ORDER BY ptc.name, pt.tag
      `)

      return tags
    } catch (error) {
      console.error("Error in getAllTags:", error)
      throw error
    }
  }

  static async getTagsByCategory(categoryId) {
    try {
      const [tags] = await db.query(
        `
        SELECT tag_id, tag, category_id
        FROM predefined_photo_tags
        WHERE category_id = ?
        ORDER BY tag
      `,
        [categoryId],
      )

      return tags
    } catch (error) {
      console.error("Error in getTagsByCategory:", error)
      throw error
    }
  }

  static async getAllCategories() {
    try {
      const [categories] = await db.query(`
        SELECT category_id, name
        FROM photo_tag_categories
        ORDER BY name
      `)

      return categories
    } catch (error) {
      console.error("Error in getAllCategories:", error)
      throw error
    }
  }

  static async validateTags(tags) {
    if (!tags || tags.length === 0) {
      return true
    }

    try {
      const placeholders = tags.map(() => "?").join(",")
      const [results] = await db.query(
        `
        SELECT tag
        FROM predefined_photo_tags
        WHERE tag IN (${placeholders})
      `,
        tags,
      )

      return results.length === tags.length
    } catch (error) {
      console.error("Error in validateTags:", error)
      throw error
    }
  }

  static async addTag(tag, categoryId) {
    try {
      const [result] = await db.query(
        `
        INSERT INTO predefined_photo_tags (tag, category_id)
        VALUES (?, ?)
      `,
        [tag, categoryId],
      )

      return {
        tag_id: result.insertId,
        tag,
        category_id: categoryId,
      }
    } catch (error) {
      console.error("Error in addTag:", error)
      throw error
    }
  }

  static async deleteTag(tagId) {
    try {
      await db.query(
        `
        DELETE FROM predefined_photo_tags
        WHERE tag_id = ?
      `,
        [tagId],
      )

      return true
    } catch (error) {
      console.error("Error in deleteTag:", error)
      throw error
    }
  }
}

module.exports = PhotoTag
