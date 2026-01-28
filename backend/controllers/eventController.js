// Event Management API
//
// Core Event Operations:
// - getAllEvents: Lists events with multiple filtering options
// - getEventById: Retrieves specific events with role-based visibility
// - createEvent: Creates new events linked to authenticated user
// - updateEvent: Modifies events with creator/role permissions
// - deleteEvent: Removes events with creator/role permissions
// - getEventTypes: Lists available event categories
//
// Registration & Attendance:
// - registerForEvent: Enrolls users in upcoming events
// - cancelRegistration: Removes user registrations
// - checkRegistrationStatus: Verifies if user is registered
// - recordAttendance: Logs user check-ins at events
// - recordCheckOut: Records user departures from events
// - getAttendance: Retrieves attendance records for events
//
// Helper Management:
// - assignHelper: Assigns staff to events
// - removeHelper: Removes staff assignments
// - volunteerForEvent: Allows helpers to offer assistance
// - getHelperEvents: Lists events for specific helpers
// - getAvailableHelpers: Finds available staff for events
// - updateHelperConfirmation: Updates helper assignment status
//
// Additional Features:
// - createReminder: Sets event reminders
// - getStatistics: Retrieves event performance metrics
const Event = require("../models/Event")
const Helper = require("../models/Helper")
const User = require("../models/User")

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const filters = {
      upcoming: req.query.upcoming === "true",
      past: req.query.past === "true",
      eventType: req.query.eventType,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      createdBy: req.query.createdBy,
      badgeId: req.query.badgeId,
      userRole: req.user ? req.user.role : "public",
    }

    const events = await Event.getAll(filters)

    res.json({
      success: true,
      count: events.length,
      events,
    })
  } catch (error) {
    console.error("Error getting events:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.getById(req.params.id)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    const userRole = req.user ? req.user.role : "public"
    if (
      (userRole === "public" && !event.publicVisible) ||
      (userRole === "helper" && !event.publicVisible && !event.helpersOnlyVisible) ||
      (userRole !== "leader" && userRole !== "admin" && event.leadersOnlyVisible)
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this event",
      })
    }

    res.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Error getting event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id,
    }

    const event = await Event.create(eventData)

    res.status(201).json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Error creating event:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error creating event",
    })
  }
}

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id
    const event = await Event.getById(eventId)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    if (event.createdBy !== req.user.id && req.user.role !== "admin" && req.user.role !== "leader") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this event",
      })
    }

    const updatedEvent = await Event.update(eventId, req.body)

    res.json({
      success: true,
      event: updatedEvent,
    })
  } catch (error) {
    console.error("Error updating event:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error updating event",
    })
  }
}

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id
    const event = await Event.getById(eventId)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    if (event.createdBy !== req.user.id && req.user.role !== "admin" && req.user.role !== "leader") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this event",
      })
    }

    await Event.delete(eventId)

    res.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.assignHelper = async (req, res) => {
  try {
    const { eventId, helperId, confirmed } = req.body

    const event = await Event.getById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    const helper = await Helper.getById(helperId)
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper not found",
      })
    }

    await Event.assignHelper(eventId, helperId, confirmed)

    res.json({
      success: true,
      message: "Helper assigned to event successfully",
    })
  } catch (error) {
    console.error("Error assigning helper to event:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error assigning helper to event",
    })
  }
}

// Remove helper from event
exports.removeHelper = async (req, res) => {
  try {
    const { eventId, helperId } = req.params

    await Event.removeHelper(eventId, helperId)

    res.json({
      success: true,
      message: "Helper removed from event successfully",
    })
  } catch (error) {
    console.error("Error removing helper from event:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id
    const userId = req.user.id
    const { notes } = req.body

    const event = await Event.getById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    const eventDate = new Date(event.startDate)
    if (eventDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot register for past events",
      })
    }

    // Register for the event
    await Event.registerParticipant(eventId, userId, notes)

    res.json({
      success: true,
      message: "Successfully registered for the event",
    })
  } catch (error) {
    console.error("Error registering for event:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error registering for event",
    })
  }
}

// Cancel registration
exports.cancelRegistration = async (req, res) => {
  try {
    const eventId = req.params.id
    const userId = req.user.id

    const event = await Event.getById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    const isRegistered = await Event.isUserRegistered(eventId, userId)
    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this event",
      })
    }

    await Event.cancelRegistration(eventId, userId)

    res.json({
      success: true,
      message: "Registration cancelled successfully",
    })
  } catch (error) {
    console.error("Error cancelling registration:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Check registration status
exports.checkRegistrationStatus = async (req, res) => {
  try {
    const eventId = req.params.id
    const userId = req.user.id

    const isRegistered = await Event.isUserRegistered(eventId, userId)

    res.json({
      success: true,
      isRegistered,
    })
  } catch (error) {
    console.error("Error checking registration status:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Record attendance
exports.recordAttendance = async (req, res) => {
  try {
    const { eventId, userId, checkInTime } = req.body

    const event = await Event.getById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    await Event.recordAttendance(eventId, userId, checkInTime)

    res.json({
      success: true,
      message: "Attendance recorded successfully",
    })
  } catch (error) {
    console.error("Error recording attendance:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Record check-out
exports.recordCheckOut = async (req, res) => {
  try {
    const eventId = req.params.eventId; 
    const { userId, checkOutTime } = req.body;

    if (!userId || !checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "userId and checkOutTime are required",
      });
    }

    const event = await Event.getById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Event.recordCheckOut(eventId, userId, checkOutTime);

    res.json({
      success: true,
      message: "Check-out recorded successfully",
    });
  } catch (error) {
    console.error("Error recording check-out:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get attendance for event
exports.getAttendance = async (req, res) => {
  try {
    const eventId = req.params.id

    const event = await Event.getById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    const attendance = await Event.getAttendance(eventId)

    res.json({
      success: true,
      attendance,
    })
  } catch (error) {
    console.error("Error getting attendance:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Create event reminder
exports.createReminder = async (req, res) => {
  try {
    const { eventId, reminderType, reminderTime } = req.body

    const event = await Event.getById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    const reminder = await Event.createReminder(eventId, reminderType, reminderTime)

    res.status(201).json({
      success: true,
      reminder,
    })
  } catch (error) {
    console.error("Error creating reminder:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error creating reminder",
    })
  }
}

// Get event statistics
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Event.getStatistics()

    res.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error getting event statistics:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

// Helper volunteer for event
exports.volunteerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id

    if (req.user.role !== "helper") {
      return res.status(403).json({
        success: false,
        message: "Only helpers can volunteer for events",
      })
    }

    const helper = await Helper.getByUserId(req.user.id)
    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper profile not found for this user",
      })
    }

    await Event.assignHelper(eventId, helper.id, false)

    res.json({
      success: true,
      message: "Successfully volunteered for the event",
    })
  } catch (error) {
    console.error("Error volunteering for event:", error)
    res.status(400).json({
      success: false,
      message: error.message || "Error volunteering for event",
    })
  }
}

// Get events for a helper
exports.getHelperEvents = async (req, res) => {
  try {
    const helperId = req.params.helperId
    const includeConfirmed = req.query.includeConfirmed !== "false"
    const includePending = req.query.includePending !== "false"

    const helper = await Helper.getByUserId(req.user.id)
    const isOwnEvents = helper && helper.id === Number.parseInt(helperId)
    const hasAdminPrivileges = req.user.role === "admin" || req.user.role === "leader"

    if (!isOwnEvents && !hasAdminPrivileges) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view these events",
      })
    }

    const events = await Event.getHelperEvents(helperId, includeConfirmed, includePending)

    res.json({
      success: true,
      count: events.length,
      events,
    })
  } catch (error) {
    console.error("Error getting helper events:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}

exports.getAvailableHelpers = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { eventDate, startTime, endTime } = req.query;

    if (!eventDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "eventDate, startTime, and endTime are required",
      });
    }

    const event = await Event.getById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const availableHelpers = await Event.getAvailableHelpers(eventId, eventDate, startTime, endTime);

    res.json({
      success: true,
      helpers: availableHelpers,
    });
  } catch (error) {
    console.error("Error getting available helpers:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.updateHelperConfirmation = async (req, res) => {
  try {
    const { eventId, helperId } = req.params;
    const { confirmed } = req.body;

    if (typeof confirmed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Confirmed status must be a boolean",
      });
    }

    const event = await Event.getById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const isAssigned = await Event.isHelperAssigned(eventId, helperId);
    if (!isAssigned) {
      return res.status(404).json({
        success: false,
        message: "Helper is not assigned to this event",
      });
    }

    await Event.updateHelperConfirmation(eventId, helperId, confirmed);

    res.json({
      success: true,
      message: `Helper ${confirmed ? "confirmed" : "unconfirmed"} successfully`,
    });
  } catch (error) {
    console.error("Error updating helper confirmation:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.getEventTypes = async (req, res) => {
  try {
    const dbConnected = await checkDbConnection()
    if (!dbConnected) {
      return res.status(500).json({ success: false, message: "Database connection error" })
    }

    const [eventTypes] = await pool.execute("SELECT DISTINCT eventType FROM events WHERE visibility = 'public'")
    res.json({ success: true, data: eventTypes.map((row) => row.eventType) })
  } catch (error) {
    console.error("Error getting event types:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}