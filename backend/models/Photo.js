// Photo Model
//
// Core Photo Operations:
// - getAllPhotos: Retrieves photos with privacy filtering
// - getPhotoById: Fetches specific photo with related data
// - addPhoto: Creates photos with tags and metadata (with transaction)
// - updatePhoto: Modifies photos and their associated tags (with transaction)
// - deletePhoto: Removes photos and their tag relationships (with transaction)
//
// Filtering & Organization:
// - getPhotosByEvent: Retrieves photos associated with specific events
// - getPhotosByTag: Fetches photos matching specific tags
//
// Handles photo metadata, tag relationships, and joins with user and event data.
// Uses transactions to maintain data integrity across related tables.
const pool = require("../config/db").pool

class Photo {
  static async getAllPhotos(includePrivate = false) {
    try {
      let query = `
        SELECT p.*, 
               u.username as uploader_name,
               e.title as event_name,
               GROUP_CONCAT(pt.tag) as tags
        FROM photos p
        LEFT JOIN users u ON p.uploaded_by = u.user_id
        LEFT JOIN events e ON p.event_id = e.event_id
        LEFT JOIN photo_tags pt ON p.photo_id = pt.photo_id
      `

      if (!includePrivate) {
        query += " WHERE p.public_visible = 1"
      }

      query += " GROUP BY p.photo_id ORDER BY p.upload_date DESC"

      const [rows] = await pool.execute(query)

      return rows.map((photo) => ({
        ...photo,
        tags: photo.tags ? photo.tags.split(",") : [],
      }))
    } catch (error) {
      console.error("Error in getAllPhotos:", error)
      throw error
    }
  }

  static async getPhotoById(photoId) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, 
                u.username as uploader_name,
                e.title as event_name,
                GROUP_CONCAT(pt.tag) as tags
         FROM photos p
         LEFT JOIN users u ON p.uploaded_by = u.user_id
         LEFT JOIN events e ON p.event_id = e.event_id
         LEFT JOIN photo_tags pt ON p.photo_id = pt.photo_id
         WHERE p.photo_id = ?
         GROUP BY p.photo_id`,
        [photoId],
      )

      if (rows.length === 0) {
        return null
      }

      const photo = rows[0]
      return {
        ...photo,
        tags: photo.tags ? photo.tags.split(",") : [],
      }
    } catch (error) {
      console.error("Error in getPhotoById:", error)
      throw error
    }
  }

  static async addPhoto(photoData) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [result] = await connection.execute(
        `INSERT INTO photos (
          title, description, image_url, thumbnail_url, 
          uploaded_by, event_id, public_visible, leaders_only_visible
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          photoData.title,
          photoData.description,
          photoData.image_url,
          photoData.thumbnail_url,
          photoData.uploaded_by,
          photoData.event_id,
          photoData.public_visible,
          photoData.leaders_only_visible,
        ],
      )

      const photoId = result.insertId

      if (photoData.tags && photoData.tags.length > 0) {
        for (const tag of photoData.tags) {
          await connection.execute("INSERT INTO photo_tags (photo_id, tag) VALUES (?, ?)", [photoId, tag])
        }
      }

      await connection.commit()

      return this.getPhotoById(photoId)
    } catch (error) {
      await connection.rollback()
      console.error("Error in addPhoto:", error)
      throw error
    } finally {
      connection.release()
    }
  }

  static async updatePhoto(photoId, photoData) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      // Update photo
      await connection.execute(
        `UPDATE photos SET
          title = ?,
          description = ?,
          image_url = ?,
          thumbnail_url = ?,
          event_id = ?,
          public_visible = ?,
          leaders_only_visible = ?
        WHERE photo_id = ?`,
        [
          photoData.title,
          photoData.description,
          photoData.image_url,
          photoData.thumbnail_url,
          photoData.event_id,
          photoData.public_visible,
          photoData.leaders_only_visible,
          photoId,
        ],
      )

      await connection.execute("DELETE FROM photo_tags WHERE photo_id = ?", [photoId])

      if (photoData.tags && photoData.tags.length > 0) {
        for (const tag of photoData.tags) {
          await connection.execute("INSERT INTO photo_tags (photo_id, tag) VALUES (?, ?)", [photoId, tag])
        }
      }

      await connection.commit()

      return this.getPhotoById(photoId)
    } catch (error) {
      await connection.rollback()
      console.error("Error in updatePhoto:", error)
      throw error
    } finally {
      connection.release()
    }
  }

  static async deletePhoto(photoId) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      await connection.execute("DELETE FROM photo_tags WHERE photo_id = ?", [photoId])

      await connection.execute("DELETE FROM photos WHERE photo_id = ?", [photoId])

      await connection.commit()
      return true
    } catch (error) {
      await connection.rollback()
      console.error("Error in deletePhoto:", error)
      throw error
    } finally {
      connection.release()
    }
  }

  static async getPhotosByEvent(eventId) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, 
                u.username as uploader_name,
                e.title as event_name,
                GROUP_CONCAT(pt.tag) as tags
         FROM photos p
         LEFT JOIN users u ON p.uploaded_by = u.user_id
         LEFT JOIN events e ON p.event_id = e.event_id
         LEFT JOIN photo_tags pt ON p.photo_id = pt.photo_id
         WHERE p.event_id = ?
         GROUP BY p.photo_id
         ORDER BY p.upload_date DESC`,
        [eventId],
      )

      return rows.map((photo) => ({
        ...photo,
        tags: photo.tags ? photo.tags.split(",") : [],
      }))
    } catch (error) {
      console.error("Error in getPhotosByEvent:", error)
      throw error
    }
  }

  static async getPhotosByTag(tag) {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, 
                u.username as uploader_name,
                e.title as event_name,
                GROUP_CONCAT(pt.tag) as tags
         FROM photos p
         LEFT JOIN users u ON p.uploaded_by = u.user_id
         LEFT JOIN events e ON p.event_id = e.event_id
         LEFT JOIN photo_tags pt ON p.photo_id = pt.photo_id
         WHERE p.photo_id IN (
           SELECT photo_id FROM photo_tags WHERE tag = ?
         )
         GROUP BY p.photo_id
         ORDER BY p.upload_date DESC`,
        [tag],
      )

      return rows.map((photo) => ({
        ...photo,
        tags: photo.tags ? photo.tags.split(",") : [],
      }))
    } catch (error) {
      console.error("Error in getPhotosByTag:", error)
      throw error
    }
  }
}

module.exports = Photo
