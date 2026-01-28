// Helper Management API
//
// Core Functions:
// - getHelperByUserId: Retrieves helper profiles with associated user details
// - registerHelper: Creates new helper profiles with skills and contact info
// - getAllHelpers: Lists all helpers with their user information
// - getHelperEvents: Fetches events assigned to specific helpers
//
// Manages volunteer staff profiles and their event assignments.
const { pool } = require("../config/db")

// Get helper by user ID
const getHelperByUserId = async (userId) => {

  try {
    const [rows] = await pool.execute(
      `
      SELECT h.*, u.username, u.email, u.first_name, u.last_name
      FROM helpers h
      JOIN users u ON h.user_id = u.user_id
      WHERE h.user_id = ?
    `,
      [userId],
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
    console.error("[helperController] Error getting helper by user ID:", error)
    throw error
  }
}

// Register a new helper
const registerHelper = async (userId, helperData) => {

  const { contactNumber, streetAddress, city, postcode, skills, notes } = helperData

  try {
    const [existing] = await pool.execute("SELECT * FROM helpers WHERE user_id = ?", [userId])

    if (existing.length > 0) {
      throw new Error("Helper profile already exists for this user")
    }

    // Check if user exists
    const [users] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [userId])

    if (users.length === 0) {
      throw new Error(`User with ID ${userId} not found`)
    }


    // Insert helper profile
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
        0, 
        null, 
        null, 
        "", 
        0, 
        0, 
        skills || "",
        notes || "",
      ],
    )


    // Get the newly created helper
    const helper = await getHelperByUserId(userId)
    return helper
  } catch (error) {
    throw error
  }
}

// Get all helpers
const getAllHelpers = async () => {

  try {
    const [rows] = await pool.execute(
      `
      SELECT h.*, u.username, u.email, u.first_name, u.last_name
      FROM helpers h
      JOIN users u ON h.user_id = u.user_id
      ORDER BY u.last_name, u.first_name
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
    throw error
  }
}

// Get helper events (events the helper has volunteered for)
const getHelperEvents = async (helperId) => {

  try {
    const [rows] = await pool.execute(
      `
      SELECT e.*, eh.confirmed
      FROM events e
      JOIN event_helpers eh ON e.event_id = eh.event_id
      WHERE eh.helper_id = ?
      ORDER BY e.start_date, e.start_time
    `,
      [helperId],
    )


    return rows.map((event) => ({
      id: event.event_id,
      title: event.title,
      description: event.description,
      locationName: event.location_name,
      locationAddress: event.location_address,
      latitude: event.latitude,
      longitude: event.longitude,
      startDate: event.start_date,
      endDate: event.end_date,
      startTime: event.start_time,
      endTime: event.end_time,
      eventType: event.event_type,
      requiredHelpers: event.required_helpers,
      maxParticipants: event.max_participants,
      createdBy: event.created_by,
      notes: event.notes,
      equipment: event.equipment,
      cost: event.cost,
      publicVisible: event.public_visible === 1,
      leadersOnlyVisible: event.leaders_only_visible === 1,
      helpersOnlyVisible: event.helpers_only_visible === 1,
      createdAt: event.created_at,
      confirmed: event.confirmed === 1,
    }))
  } catch (error) {
    console.error("[helperController] Error getting helper events:", error)
    throw error
  }
}

module.exports = {
  getHelperByUserId,
  registerHelper,
  getAllHelpers,
  getHelperEvents,
}
