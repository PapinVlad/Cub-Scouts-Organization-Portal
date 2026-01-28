// Event Management Model
//
// Core Event Operations:
// - create: Creates events with associated badges and metadata
// - getAll: Retrieves events with filtering options and related counts
// - getById: Fetches complete event details with badges, helpers, and participants
// - update: Modifies events and their associated data
// - delete: Removes events and all related records (with transaction)
//
// Participant Management:
// - registerParticipant: Enrolls users in events with capacity checks
// - cancelRegistration: Updates registration status to cancelled
// - isUserRegistered: Verifies if user is registered for an event
// - recordAttendance: Logs user check-ins at events
// - recordCheckOut: Records user departures from events
// - getAttendance: Retrieves attendance records for events
//
// Helper Management:
// - assignHelper: Assigns staff to events with confirmation status
// - removeHelper: Removes staff assignments
// - getHelperEvents: Lists events for specific helpers
// - getAvailableHelpers: Finds available staff based on scheduling
// - updateHelperConfirmation: Updates helper assignment status
//
// Additional Features:
// - createReminder: Sets event reminders
// - markReminderSent: Updates reminder status
// - getPendingReminders: Retrieves due reminders
// - getStatistics: Generates comprehensive event metrics
//
// Uses transactions for data integrity across multiple tables.
const { pool } = require("../config/db")

class Event {
  // Create a new event
  static async create(eventData) {
    const {
      title,
      description,
      locationName,
      locationAddress,
      latitude,
      longitude,
      startDate,
      endDate,
      startTime,
      endTime,
      eventType,
      requiredHelpers,
      maxParticipants,
      createdBy,
      notes,
      equipment,
      cost,
      publicVisible,
      leadersOnlyVisible,
      helpersOnlyVisible,
      badgeIds,
    } = eventData

    try {
      const connection = await pool.getConnection()
      await connection.beginTransaction()

      try {
        const [result] = await connection.execute(
          `
          INSERT INTO events (
            title, description, location_name, location_address, latitude, longitude,
            start_date, end_date, start_time, end_time, event_type, required_helpers,
            max_participants, created_by, notes, equipment, cost, public_visible, 
            leaders_only_visible, helpers_only_visible
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            title,
            description || "",
            locationName || "",
            locationAddress || "",
            latitude || null,
            longitude || null,
            startDate,
            endDate || null,
            startTime || null,
            endTime || null,
            eventType || "Meeting",
            requiredHelpers || 0,
            maxParticipants || 0,
            createdBy,
            notes || "",
            equipment || "",
            cost || null,
            publicVisible !== undefined ? publicVisible : true,
            leadersOnlyVisible || false,
            helpersOnlyVisible || false,
          ],
        )

        const eventId = result.insertId

        if (badgeIds && Array.isArray(badgeIds) && badgeIds.length > 0) {
          for (const badgeId of badgeIds) {
            await connection.execute("INSERT INTO event_badges (event_id, badge_id) VALUES (?, ?)", [eventId, badgeId])
          }
        }

        await connection.commit()
        connection.release()

        return {
          id: eventId,
          ...eventData,
        }
      } catch (error) {
        await connection.rollback()
        connection.release()
        throw error
      }
    } catch (error) {
      console.error("Error creating event:", error)
      throw error
    }
  }

  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT e.*, 
               u.username as creator_username, u.first_name as creator_first_name, u.last_name as creator_last_name,
               COUNT(DISTINCT eb.badge_id) as badge_count,
               COUNT(DISTINCT eh.helper_id) as helper_count,
               COUNT(DISTINCT ep.participant_id) as participant_count
        FROM events e
        LEFT JOIN users u ON e.created_by = u.user_id
        LEFT JOIN event_badges eb ON e.event_id = eb.event_id
        LEFT JOIN event_helpers eh ON e.event_id = eh.event_id
        LEFT JOIN event_participants ep ON e.event_id = ep.event_id AND ep.status != 'cancelled'
      `

      const queryParams = []
      const whereConditions = []

      if (filters.upcoming) {
        whereConditions.push("e.start_date >= CURDATE()")
      }

      if (filters.past) {
        whereConditions.push("e.start_date < CURDATE()")
      }

      if (filters.eventType) {
        whereConditions.push("e.event_type = ?")
        queryParams.push(filters.eventType)
      }

      if (filters.startDate) {
        whereConditions.push("e.start_date >= ?")
        queryParams.push(filters.startDate)
      }

      if (filters.endDate) {
        whereConditions.push("e.start_date <= ?")
        queryParams.push(filters.endDate)
      }

      if (filters.createdBy) {
        whereConditions.push("e.created_by = ?")
        queryParams.push(filters.createdBy)
      }

      if (filters.badgeId) {
        whereConditions.push("EXISTS (SELECT 1 FROM event_badges WHERE event_id = e.event_id AND badge_id = ?)")
        queryParams.push(filters.badgeId)
      }

      if (filters.userRole) {
  if (filters.userRole === "public") {
    whereConditions.push("e.public_visible = TRUE")
  } else if (filters.userRole === "helper") {
    whereConditions.push("(e.public_visible = TRUE OR e.helpers_only_visible = TRUE)")
  } else if (filters.userRole === "leader" || filters.userRole === "admin") {
    whereConditions.push("(e.public_visible = TRUE OR e.leaders_only_visible = TRUE)")
  }
}

      if (whereConditions.length > 0) {
        query += " WHERE " + whereConditions.join(" AND ")
      }

      query += " GROUP BY e.event_id"

      query += " ORDER BY e.start_date ASC, e.start_time ASC"

      const [rows] = await pool.execute(query, queryParams)

      return rows.map((row) => ({
        id: row.event_id,
        title: row.title,
        description: row.description,
        locationName: row.location_name,
        locationAddress: row.location_address,
        latitude: row.latitude,
        longitude: row.longitude,
        startDate: row.start_date,
        endDate: row.end_date,
        startTime: row.start_time,
        endTime: row.end_time,
        eventType: row.event_type,
        requiredHelpers: row.required_helpers,
        maxParticipants: row.max_participants || 0,
        createdBy: row.created_by,
        notes: row.notes,
        equipment: row.equipment,
        cost: row.cost,
        publicVisible: row.public_visible === 1,
        leadersOnlyVisible: row.leaders_only_visible === 1,
        helpersOnlyVisible: row.helpers_only_visible === 1,
        createdAt: row.created_at,
        creator: row.created_by
          ? {
              id: row.created_by,
              username: row.creator_username,
              firstName: row.creator_first_name,
              lastName: row.creator_last_name,
            }
          : null,
        badgeCount: row.badge_count,
        helperCount: row.helper_count,
        participantCount: row.participant_count || 0,
      }))
    } catch (error) {
      console.error("Error getting events:", error)
      throw error
    }
  }

  static async getById(eventId) {
    try {
      const [events] = await pool.execute(
        `
        SELECT e.*, 
               u.username as creator_username, u.first_name as creator_first_name, u.last_name as creator_last_name
        FROM events e
        LEFT JOIN users u ON e.created_by = u.user_id
        WHERE e.event_id = ?
      `,
        [eventId],
      )

      if (events.length === 0) {
        return null
      }

      const event = events[0]

      const [badges] = await pool.execute(
        `
        SELECT b.badge_id, b.name, b.category, b.description, b.image_url, b.difficulty_level
        FROM badges b
        JOIN event_badges eb ON b.badge_id = eb.badge_id
        WHERE eb.event_id = ?
      `,
        [eventId],
      )

      const [helpers] = await pool.execute(
        `
        SELECT h.helper_id, u.user_id, u.username, u.first_name, u.last_name, u.email, eh.confirmed
        FROM helpers h
        JOIN users u ON h.user_id = u.user_id
        JOIN event_helpers eh ON h.helper_id = eh.helper_id
        WHERE eh.event_id = ?
      `,
        [eventId],
      )

      const [participants] = await pool.execute(
        `
        SELECT ep.participant_id, u.user_id, u.username, u.first_name, u.last_name, u.email, 
               ep.registration_date, ep.status, ep.notes
        FROM event_participants ep
        JOIN users u ON ep.user_id = u.user_id
        WHERE ep.event_id = ?
      `,
        [eventId],
      )

      return {
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
        maxParticipants: event.max_participants || 0,
        createdBy: event.created_by,
        notes: event.notes,
        equipment: event.equipment,
        cost: event.cost,
        publicVisible: event.public_visible === 1,
        leadersOnlyVisible: event.leaders_only_visible === 1,
        helpersOnlyVisible: event.helpers_only_visible === 1,
        createdAt: event.created_at,
        creator: event.created_by
          ? {
              id: event.created_by,
              username: event.creator_username,
              firstName: event.creator_first_name,
              lastName: event.creator_last_name,
            }
          : null,
        badges: badges.map((badge) => ({
          id: badge.badge_id,
          name: badge.name,
          category: badge.category,
          description: badge.description,
          imageUrl: badge.image_url,
          difficultyLevel: badge.difficulty_level,
        })),
        helpers: helpers.map((helper) => ({
          id: helper.helper_id,
          userId: helper.user_id,
          username: helper.username,
          firstName: helper.first_name,
          lastName: helper.last_name,
          email: helper.email,
          confirmed: helper.confirmed === 1,
        })),
        participants: participants.map((participant) => ({
          id: participant.participant_id,
          userId: participant.user_id,
          username: participant.username,
          firstName: participant.first_name,
          lastName: participant.last_name,
          email: participant.email,
          registrationDate: participant.registration_date,
          status: participant.status,
          notes: participant.notes,
        })),
      }
    } catch (error) {
      console.error("Error getting event by ID:", error)
      throw error
    }
  }

  // Update event
  static async update(eventId, eventData) {
    const {
      title,
      description,
      locationName,
      locationAddress,
      latitude,
      longitude,
      startDate,
      endDate,
      startTime,
      endTime,
      eventType,
      requiredHelpers,
      maxParticipants,
      notes,
      equipment,
      cost,
      publicVisible,
      leadersOnlyVisible,
      helpersOnlyVisible,
      badgeIds,
    } = eventData

    try {
      const connection = await pool.getConnection()
      await connection.beginTransaction()

      try {
        await connection.execute(
          `
          UPDATE events SET
            title = ?, description = ?, location_name = ?, location_address = ?, 
            latitude = ?, longitude = ?, start_date = ?, end_date = ?, 
            start_time = ?, end_time = ?, event_type = ?, required_helpers = ?,
            max_participants = ?, notes = ?, equipment = ?, cost = ?, 
            public_visible = ?, leaders_only_visible = ?, helpers_only_visible = ?
          WHERE event_id = ?
        `,
          [
            title,
            description || "",
            locationName || "",
            locationAddress || "",
            latitude || null,
            longitude || null,
            startDate,
            endDate || null,
            startTime || null,
            endTime || null,
            eventType || "Meeting",
            requiredHelpers || 0,
            maxParticipants || 0,
            notes || "",
            equipment || "",
            cost || null,
            publicVisible !== undefined ? publicVisible : true,
            leadersOnlyVisible || false,
            helpersOnlyVisible || false,
            eventId,
          ],
        )

        if (badgeIds && Array.isArray(badgeIds)) {
          await connection.execute("DELETE FROM event_badges WHERE event_id = ?", [eventId])

          for (const badgeId of badgeIds) {
            await connection.execute("INSERT INTO event_badges (event_id, badge_id) VALUES (?, ?)", [eventId, badgeId])
          }
        }

        await connection.commit()
        connection.release()

        return {
          id: eventId,
          ...eventData,
        }
      } catch (error) {
        await connection.rollback()
        connection.release()
        throw error
      }
    } catch (error) {
      console.error("Error updating event:", error)
      throw error
    }
  }

  // Delete event
  static async delete(eventId) {
    try {
      const connection = await pool.getConnection()
      await connection.beginTransaction()

      try {
        await connection.execute("DELETE FROM event_badges WHERE event_id = ?", [eventId])

        await connection.execute("DELETE FROM event_helpers WHERE event_id = ?", [eventId])

        await connection.execute("DELETE FROM event_participants WHERE event_id = ?", [eventId])

        await connection.execute("DELETE FROM event_attendance WHERE event_id = ?", [eventId])

        await connection.execute("DELETE FROM event_reminders WHERE event_id = ?", [eventId])

        await connection.execute("DELETE FROM events WHERE event_id = ?", [eventId])

        await connection.commit()
        connection.release()

        return true
      } catch (error) {
        await connection.rollback()
        connection.release()
        throw error
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      throw error
    }
  }

  // Assign helper to event
  static async assignHelper(eventId, helperId, confirmed = false) {
    try {
      const [existing] = await pool.execute("SELECT * FROM event_helpers WHERE event_id = ? AND helper_id = ?", [
        eventId,
        helperId,
      ])

      if (existing.length > 0) {
        await pool.execute("UPDATE event_helpers SET confirmed = ? WHERE event_id = ? AND helper_id = ?", [
          confirmed ? 1 : 0,
          eventId,
          helperId,
        ])
      } else {
        await pool.execute("INSERT INTO event_helpers (event_id, helper_id, confirmed) VALUES (?, ?, ?)", [
          eventId,
          helperId,
          confirmed ? 1 : 0,
        ])
      }

      return true
    } catch (error) {
      console.error("Error assigning helper to event:", error)
      throw error
    }
  }

  // Remove helper from event
  static async removeHelper(eventId, helperId) {
    try {
      await pool.execute("DELETE FROM event_helpers WHERE event_id = ? AND helper_id = ?", [eventId, helperId])

      return true
    } catch (error) {
      console.error("Error removing helper from event:", error)
      throw error
    }
  }

  // Register participant for event
  static async registerParticipant(eventId, userId, notes = "") {
    try {
      const [existing] = await pool.execute("SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?", [
        eventId,
        userId,
      ])

      if (existing.length > 0) {
        throw new Error("User is already registered for this event")
      }

      const [eventResult] = await pool.execute("SELECT max_participants FROM events WHERE event_id = ?", [eventId])

      if (eventResult.length === 0) {
        throw new Error("Event not found")
      }

      const maxParticipants = eventResult[0].max_participants

      if (maxParticipants > 0) {
        const [countResult] = await pool.execute(
          "SELECT COUNT(*) as count FROM event_participants WHERE event_id = ? AND status != 'cancelled'",
          [eventId],
        )

        if (countResult[0].count >= maxParticipants) {
          throw new Error("Event has reached maximum number of participants")
        }
      }

      const [result] = await pool.execute(
        "INSERT INTO event_participants (event_id, user_id, notes) VALUES (?, ?, ?)",
        [eventId, userId, notes],
      )

      return {
        id: result.insertId,
        eventId,
        userId,
        registrationDate: new Date(),
        status: "registered",
        notes,
      }
    } catch (error) {
      console.error("Error registering participant:", error)
      throw error
    }
  }

  // Cancel participant registration
  static async cancelRegistration(eventId, userId) {
    try {
      await pool.execute("UPDATE event_participants SET status = 'cancelled' WHERE event_id = ? AND user_id = ?", [
        eventId,
        userId,
      ])

      return true
    } catch (error) {
      console.error("Error cancelling registration:", error)
      throw error
    }
  }

  // Check if user is registered for event
  static async isUserRegistered(eventId, userId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM event_participants WHERE event_id = ? AND user_id = ? AND status != 'cancelled'",
        [eventId, userId],
      )

      return rows.length > 0
    } catch (error) {
      console.error("Error checking registration:", error)
      throw error
    }
  }

  // Record attendance
  static async recordAttendance(eventId, userId, checkInTime = null) {
    try {
      const [existing] = await pool.execute("SELECT * FROM event_attendance WHERE event_id = ? AND user_id = ?", [
        eventId,
        userId,
      ])

      if (existing.length > 0) {
        await pool.execute("UPDATE event_attendance SET check_in_time = ? WHERE event_id = ? AND user_id = ?", [
          checkInTime || new Date(),
          eventId,
          userId,
        ])
      } else {
        await pool.execute("INSERT INTO event_attendance (event_id, user_id, check_in_time) VALUES (?, ?, ?)", [
          eventId,
          userId,
          checkInTime || new Date(),
        ])
      }

      await pool.execute("UPDATE event_participants SET status = 'attended' WHERE event_id = ? AND user_id = ?", [
        eventId,
        userId,
      ])

      return true
    } catch (error) {
      console.error("Error recording attendance:", error)
      throw error
    }
  }

  // Record check-out
  static async recordCheckOut(eventId, userId, checkOutTime = null) {
  try {
    await pool.execute(
      "UPDATE event_attendance SET check_out_time = ? WHERE event_id = ? AND user_id = ?",
      [checkOutTime || new Date(), eventId, userId]
    );

    return true;
  } catch (error) {
    console.error("Error recording check-out:", error);
    throw error;
  }
}

  // Get attendance for event
  static async getAttendance(eventId) {
    try {
      const [rows] = await pool.execute(
        `
        SELECT ea.*, u.username, u.first_name, u.last_name, u.email
        FROM event_attendance ea
        JOIN users u ON ea.user_id = u.user_id
        WHERE ea.event_id = ?
        ORDER BY ea.check_in_time
      `,
        [eventId],
      )

      return rows.map((row) => ({
        id: row.attendance_id,
        eventId: row.event_id,
        userId: row.user_id,
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        checkInTime: row.check_in_time,
        checkOutTime: row.check_out_time,
        notes: row.notes,
      }))
    } catch (error) {
      console.error("Error getting attendance:", error)
      throw error
    }
  }

  // Create event reminder
  static async createReminder(eventId, reminderType, reminderTime) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO event_reminders (event_id, reminder_type, reminder_time) VALUES (?, ?, ?)",
        [eventId, reminderType, reminderTime],
      )

      return {
        id: result.insertId,
        eventId,
        reminderType,
        reminderTime,
        sent: false,
        sentTime: null,
      }
    } catch (error) {
      console.error("Error creating reminder:", error)
      throw error
    }
  }

  // Mark reminder as sent
  static async markReminderSent(reminderId) {
    try {
      await pool.execute("UPDATE event_reminders SET sent = TRUE, sent_time = ? WHERE reminder_id = ?", [
        new Date(),
        reminderId,
      ])

      return true
    } catch (error) {
      console.error("Error marking reminder as sent:", error)
      throw error
    }
  }

  // Get pending reminders
  static async getPendingReminders() {
    try {
      const [rows] = await pool.execute(
        `
        SELECT er.*, e.title, e.start_date, e.start_time
        FROM event_reminders er
        JOIN events e ON er.event_id = e.event_id
        WHERE er.sent = FALSE AND er.reminder_time <= NOW()
      `,
      )

      return rows.map((row) => ({
        id: row.reminder_id,
        eventId: row.event_id,
        eventTitle: row.title,
        eventDate: row.start_date,
        eventTime: row.start_time,
        reminderType: row.reminder_type,
        reminderTime: row.reminder_time,
      }))
    } catch (error) {
      console.error("Error getting pending reminders:", error)
      throw error
    }
  }

  // Get helper events
  static async getHelperEvents(helperId, includeConfirmed = true, includePending = true) {
    try {
      let query = `
        SELECT e.*, eh.confirmed,
               u.username as creator_username, u.first_name as creator_first_name, u.last_name as creator_last_name
        FROM events e
        JOIN event_helpers eh ON e.event_id = eh.event_id
        LEFT JOIN users u ON e.created_by = u.user_id
        WHERE eh.helper_id = ?
      `

      const queryParams = [helperId]

      if (includeConfirmed && !includePending) {
        query += " AND eh.confirmed = TRUE"
      } else if (!includeConfirmed && includePending) {
        query += " AND eh.confirmed = FALSE"
      }

      query += " ORDER BY e.start_date ASC, e.start_time ASC"

      const [rows] = await pool.execute(query, queryParams)

      return rows.map((row) => ({
        id: row.event_id,
        title: row.title,
        description: row.description,
        locationName: row.location_name,
        locationAddress: row.location_address,
        latitude: row.latitude,
        longitude: row.longitude,
        startDate: row.start_date,
        endDate: row.end_date,
        startTime: row.start_time,
        endTime: row.end_time,
        eventType: row.event_type,
        requiredHelpers: row.required_helpers,
        maxParticipants: row.max_participants || 0,
        createdBy: row.created_by,
        notes: row.notes,
        equipment: row.equipment,
        cost: row.cost,
        publicVisible: row.public_visible === 1,
        leadersOnlyVisible: row.leaders_only_visible === 1,
        helpersOnlyVisible: row.helpers_only_visible === 1,
        createdAt: row.created_at,
        confirmed: row.confirmed === 1,
        creator: row.created_by
          ? {
              id: row.created_by,
              username: row.creator_username,
              firstName: row.creator_first_name,
              lastName: row.creator_last_name,
            }
          : null,
      }))
    } catch (error) {
      console.error("Error getting helper events:", error)
      throw error
    }
  }

  // Get event statistics
  static async getStatistics() {
    try {
      const [totalResult] = await pool.execute("SELECT COUNT(*) as total FROM events")
      const total = totalResult[0].total

      const [upcomingResult] = await pool.execute("SELECT COUNT(*) as count FROM events WHERE start_date >= CURDATE()")
      const upcoming = upcomingResult[0].count

      const [byTypeResult] = await pool.execute(`
        SELECT event_type, COUNT(*) as count
        FROM events
        GROUP BY event_type
        ORDER BY count DESC
      `)

      const [byMonthResult] = await pool.execute(`
        SELECT MONTH(start_date) as month, YEAR(start_date) as year, COUNT(*) as count
        FROM events
        WHERE start_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY YEAR(start_date), MONTH(start_date)
        ORDER BY year ASC, month ASC
      `)

      const [needingHelpersResult] = await pool.execute(`
        SELECT e.event_id, e.title, e.start_date, e.required_helpers, COUNT(eh.helper_id) as current_helpers
        FROM events e
        LEFT JOIN event_helpers eh ON e.event_id = eh.event_id
        WHERE e.start_date >= CURDATE()
        GROUP BY e.event_id
        HAVING current_helpers < e.required_helpers
        ORDER BY e.start_date ASC
        LIMIT 5
      `)

      const [participantsResult] = await pool.execute(`
        SELECT COUNT(*) as count FROM event_participants WHERE status != 'cancelled'
      `)
      const totalParticipants = participantsResult[0].count

      const [popularEventsResult] = await pool.execute(`
        SELECT e.event_id, e.title, COUNT(ep.participant_id) as participant_count
        FROM events e
        JOIN event_participants ep ON e.event_id = ep.event_id
        WHERE ep.status != 'cancelled'
        GROUP BY e.event_id
        ORDER BY participant_count DESC
        LIMIT 5
      `)

      return {
        total,
        upcoming,
        totalParticipants,
        byType: byTypeResult,
        byMonth: byMonthResult,
        needingHelpers: needingHelpersResult.map((row) => ({
          id: row.event_id,
          title: row.title,
          startDate: row.start_date,
          requiredHelpers: row.required_helpers,
          currentHelpers: row.current_helpers,
          neededHelpers: row.required_helpers - row.current_helpers,
        })),
        popularEvents: popularEventsResult.map((row) => ({
          id: row.event_id,
          title: row.title,
          participantCount: row.participant_count,
        })),
      }
    } catch (error) {
      console.error("Error getting event statistics:", error)
      throw error
    }
  }
  static async getAvailableHelpers(eventId, eventDate, startTime, endTime) {
    try {
      const eventStart = `${eventDate} ${startTime}`;
      const eventEnd = `${eventDate} ${endTime}`;

      const [availableHelpers] = await pool.execute(
        `
        SELECT h.helper_id, u.user_id, u.first_name, u.last_name, u.email
        FROM helpers h
        JOIN users u ON h.user_id = u.user_id
        LEFT JOIN event_helpers eh ON h.helper_id = eh.helper_id
        LEFT JOIN events e ON eh.event_id = e.event_id
        WHERE h.helper_id NOT IN (
          SELECT eh2.helper_id
          FROM event_helpers eh2
          JOIN events e2 ON eh2.event_id = e2.event_id
          WHERE e2.event_id != ?
            AND (
              (e2.start_date = ? AND e2.start_time <= ? AND e2.end_time >= ?)
              OR (e2.start_date = ? AND e2.start_time >= ? AND e2.start_time < ?)
              OR (e2.start_date = ? AND e2.end_time > ? AND e2.end_time <= ?)
            )
        )
        AND h.helper_id NOT IN (
          SELECT helper_id FROM event_helpers WHERE event_id = ?
        )
        GROUP BY h.helper_id, u.user_id, u.first_name, u.last_name, u.email
        `,
        [
          eventId,
          eventDate, eventEnd, eventStart, 
          eventDate, eventStart, eventEnd, 
          eventDate, eventStart, eventEnd, 
          eventId, 
        ]
      );

      return availableHelpers.map((helper) => ({
        id: helper.helper_id,
        userId: helper.user_id,
        firstName: helper.first_name,
        lastName: helper.last_name,
        email: helper.email,
      }));
    } catch (error) {
      console.error("Error getting available helpers:", error);
      throw error;
    }
  }
  static async isHelperAssigned(eventId, helperId) {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM event_helpers WHERE event_id = ? AND helper_id = ?",
        [eventId, helperId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error("Error checking if helper is assigned:", error);
      throw error;
    }
  }

  // Update helper confirmation status
  static async updateHelperConfirmation(eventId, helperId, confirmed) {
    try {
      await pool.execute(
        "UPDATE event_helpers SET confirmed = ? WHERE event_id = ? AND helper_id = ?",
        [confirmed ? 1 : 0, eventId, helperId]
      );
      return true;
    } catch (error) {
      console.error("Error updating helper confirmation:", error);
      throw error;
    }
  }
  
}

module.exports = Event
