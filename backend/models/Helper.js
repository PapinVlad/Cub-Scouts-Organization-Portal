// Helper Profile Model
//
// Core Profile Operations:
// - getById: Retrieves helper profiles with user details
// - getByUserId: Fetches helper data by associated user ID
// - getAll: Lists all helpers with their user information
// - create: Creates new helper profiles with contact and verification data
// - update: Modifies existing helper profile information
// - delete: Removes helper profiles and related records (with transaction)
//
// Availability Management:
// - addAvailability: Records helper time slots
// - updateAvailability: Modifies existing availability
// - deleteAvailability: Removes availability records
// - getAvailability: Retrieves helper's schedule organized by day
//
// Training Management:
// - addTrainingModule: Records training module completion
// - updateTrainingModule: Updates training status
// - deleteTrainingModule: Removes training records
// - getTrainingModules: Lists helper's training progress
//
// Manages helper profiles with verification status, contact details, and scheduling.
const { pool } = require("../config/db")

class Helper {
  static async getById(helperId) {
    try {
      const [rows] = await pool.execute(
        `
        SELECT h.*, u.username, u.email, u.first_name, u.last_name
        FROM helpers h
        JOIN users u ON h.user_id = u.user_id
        WHERE h.helper_id = ?
      `,
        [helperId],
      )

      if (rows.length === 0) {
        return null
      }

      const helper = rows[0]

      return {
        id: helper.helper_id,
        userId: helper.user_id,
        username: helper.username,
        email: helper.email,
        firstName: helper.first_name,
        lastName: helper.last_name,
        contactNumber: helper.contact_number,
        streetAddress: helper.street_address,
        city: helper.city,
        postcode: helper.postcode,
        disclosureStatus: helper.disclosure_status === 1,
        disclosureDateObtained: helper.disclosure_date_obtained,
        disclosureExpiryDate: helper.disclosure_expiry_date,
        disclosureReference: helper.disclosure_reference,
        trainingCompleted: helper.training_completed === 1,
        trainingInProgress: helper.training_in_progress === 1,
        skills: helper.skills,
        notes: helper.notes,
      }
    } catch (error) {
      console.error("Error getting helper by ID:", error)
      throw error
    }
  }

  // Get helper by user ID
  static async getByUserId(userId) {
    try {
      const [rows] = await pool.execute(
        `
        SELECT h.*, 
               u.username, u.email, u.first_name, u.last_name, 
               u.created_at, u.last_login
        FROM helpers h
        JOIN users u ON h.user_id = u.user_id
        WHERE h.user_id = ?
      `,
        [userId]
      );

      if (rows.length === 0) {
        return null;
      }

      const helper = rows[0];

      return {
        id: helper.helper_id,
        userId: helper.user_id,
        username: helper.username,
        email: helper.email,
        firstName: helper.first_name,
        lastName: helper.last_name,
        createdAt: helper.created_at, 
        lastLogin: helper.last_login, 
        contactNumber: helper.contact_number,
        streetAddress: helper.street_address,
        city: helper.city,
        postcode: helper.postcode,
        disclosureStatus: helper.disclosure_status === 1,
        disclosureDateObtained: helper.disclosure_date_obtained,
        disclosureExpiryDate: helper.disclosure_expiry_date,
        disclosureReference: helper.disclosure_reference,
        trainingCompleted: helper.training_completed === 1,
        trainingInProgress: helper.training_in_progress === 1,
        skills: helper.skills,
        notes: helper.notes,
      };
    } catch (error) {
      console.error("Error getting helper by user ID:", error);
      throw error;
    }
  }

  // Get all helpers
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        `
        SELECT h.*, u.username, u.email, u.first_name, u.last_name
        FROM helpers h
        JOIN users u ON h.user_id = u.user_id
        ORDER BY u.first_name, u.last_name
      `,
      )

      return rows.map((helper) => ({
        id: helper.helper_id,
        userId: helper.user_id,
        username: helper.username,
        email: helper.email,
        firstName: helper.first_name,
        lastName: helper.last_name,
        contactNumber: helper.contact_number,
        streetAddress: helper.street_address,
        city: helper.city,
        postcode: helper.postcode,
        disclosureStatus: helper.disclosure_status === 1,
        disclosureDateObtained: helper.disclosure_date_obtained,
        disclosureExpiryDate: helper.disclosure_expiry_date,
        disclosureReference: helper.disclosure_reference,
        trainingCompleted: helper.training_completed === 1,
        trainingInProgress: helper.training_in_progress === 1,
        skills: helper.skills,
        notes: helper.notes,
      }))
    } catch (error) {
      console.error("Error getting all helpers:", error)
      throw error
    }
  }

  // Create helper profile
  static async create(helperData) {
    const {
      userId,
      contactNumber,
      streetAddress,
      city,
      postcode,
      disclosureStatus,
      disclosureDateObtained,
      disclosureExpiryDate,
      disclosureReference,
      trainingCompleted,
      trainingInProgress,
      skills,
      notes,
    } = helperData

    try {
      const [existing] = await pool.execute("SELECT * FROM helpers WHERE user_id = ?", [userId])

      if (existing.length > 0) {
        throw new Error("Helper profile already exists for this user")
      }

      const [result] = await pool.execute(
        `
        INSERT INTO helpers (
          user_id, contact_number, street_address, city, postcode,
          disclosure_status, disclosure_date_obtained, disclosure_expiry_date, disclosure_reference,
          training_completed, training_in_progress, skills, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          userId,
          contactNumber || "",
          streetAddress || "",
          city || "",
          postcode || "",
          disclosureStatus ? 1 : 0,
          disclosureDateObtained || null,
          disclosureExpiryDate || null,
          disclosureReference || "",
          trainingCompleted ? 1 : 0,
          trainingInProgress ? 1 : 0,
          skills || "",
          notes || "",
        ],
      )

      return {
        id: result.insertId,
        userId,
        ...helperData,
      }
    } catch (error) {
      console.error("Error creating helper profile:", error)
      throw error
    }
  }

  // Update helper profile
  static async update(helperId, helperData) {
    const {
      contactNumber,
      streetAddress,
      city,
      postcode,
      disclosureStatus,
      disclosureDateObtained,
      disclosureExpiryDate,
      disclosureReference,
      trainingCompleted,
      trainingInProgress,
      skills,
      notes,
    } = helperData

    try {
      await pool.execute(
        `
        UPDATE helpers SET
          contact_number = ?, street_address = ?, city = ?, postcode = ?,
          disclosure_status = ?, disclosure_date_obtained = ?, disclosure_expiry_date = ?, disclosure_reference = ?,
          training_completed = ?, training_in_progress = ?, skills = ?, notes = ?
        WHERE helper_id = ?
      `,
        [
          contactNumber || "",
          streetAddress || "",
          city || "",
          postcode || "",
          disclosureStatus ? 1 : 0,
          disclosureDateObtained || null,
          disclosureExpiryDate || null,
          disclosureReference || "",
          trainingCompleted ? 1 : 0,
          trainingInProgress ? 1 : 0,
          skills || "",
          notes || "",
          helperId,
        ],
      )

      return {
        id: helperId,
        ...helperData,
      }
    } catch (error) {
      console.error("Error updating helper profile:", error)
      throw error
    }
  }

  static async delete(helperId) {
    try {
      const connection = await pool.getConnection()
      await connection.beginTransaction()

      try {
        await connection.execute("DELETE FROM helper_availability WHERE helper_id = ?", [helperId])

        await connection.execute("DELETE FROM helper_training_modules WHERE helper_id = ?", [helperId])

        await connection.execute("DELETE FROM event_helpers WHERE helper_id = ?", [helperId])

        await connection.execute("DELETE FROM helpers WHERE helper_id = ?", [helperId])

        await connection.commit()
        connection.release()

        return true
      } catch (error) {
        await connection.rollback()
        connection.release()
        throw error
      }
    } catch (error) {
      console.error("Error deleting helper profile:", error)
      throw error
    }
  }

  static async addAvailability(helperId, availabilityData) {
    const { dayOfWeek, startTime, endTime } = availabilityData

    try {
      const [result] = await pool.execute(
        "INSERT INTO helper_availability (helper_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)",
        [helperId, dayOfWeek, startTime, endTime],
      )

      return {
        id: result.insertId,
        helperId,
        dayOfWeek,
        startTime,
        endTime,
      }
    } catch (error) {
      console.error("Error adding helper availability:", error)
      throw error
    }
  }

  // Update helper availability
  static async updateAvailability(availabilityId, availabilityData) {
    const { dayOfWeek, startTime, endTime } = availabilityData

    try {
      await pool.execute(
        "UPDATE helper_availability SET day_of_week = ?, start_time = ?, end_time = ? WHERE availability_id = ?",
        [dayOfWeek, startTime, endTime, availabilityId],
      )

      return {
        id: availabilityId,
        ...availabilityData,
      }
    } catch (error) {
      console.error("Error updating helper availability:", error)
      throw error
    }
  }

  // Delete helper availability
  static async deleteAvailability(availabilityId) {
    try {
      await pool.execute("DELETE FROM helper_availability WHERE availability_id = ?", [availabilityId])

      return true
    } catch (error) {
      console.error("Error deleting helper availability:", error)
      throw error
    }
  }

  // Get helper availability
  static async getAvailability(helperId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM helper_availability WHERE helper_id = ? ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), start_time",
        [helperId],
      )

      return rows.map((availability) => ({
        id: availability.availability_id,
        helperId: availability.helper_id,
        dayOfWeek: availability.day_of_week,
        startTime: availability.start_time,
        endTime: availability.end_time,
      }))
    } catch (error) {
      console.error("Error getting helper availability:", error)
      throw error
    }
  }

  // Add training module
  static async addTrainingModule(helperId, moduleData) {
    const { moduleName, completed, dateCompleted } = moduleData

    try {
      const [result] = await pool.execute(
        "INSERT INTO helper_training_modules (helper_id, module_name, completed, date_completed) VALUES (?, ?, ?, ?)",
        [helperId, moduleName, completed ? 1 : 0, dateCompleted || null],
      )

      return {
        id: result.insertId,
        helperId,
        moduleName,
        completed,
        dateCompleted,
      }
    } catch (error) {
      console.error("Error adding training module:", error)
      throw error
    }
  }

  // Update training module
  static async updateTrainingModule(moduleId, moduleData) {
    const { completed, dateCompleted } = moduleData

    try {
      await pool.execute("UPDATE helper_training_modules SET completed = ?, date_completed = ? WHERE module_id = ?", [
        completed ? 1 : 0,
        dateCompleted || null,
        moduleId,
      ])

      return {
        id: moduleId,
        ...moduleData,
      }
    } catch (error) {
      console.error("Error updating training module:", error)
      throw error
    }
  }

  // Delete training module
  static async deleteTrainingModule(moduleId) {
    try {
      await pool.execute("DELETE FROM helper_training_modules WHERE module_id = ?", [moduleId])

      return true
    } catch (error) {
      console.error("Error deleting training module:", error)
      throw error
    }
  }

  // Get training modules
  static async getTrainingModules(helperId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM helper_training_modules WHERE helper_id = ? ORDER BY module_name",
        [helperId],
      )

      return rows.map((module) => ({
        id: module.module_id,
        helperId: module.helper_id,
        moduleName: module.module_name,
        completed: module.completed === 1,
        dateCompleted: module.date_completed,
      }))
    } catch (error) {
      console.error("Error getting training modules:", error)
      throw error
    }
  }
}

module.exports = Helper
