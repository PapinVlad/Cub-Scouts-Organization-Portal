// Newsletter Management API
//
// Subscription Functions:
// - subscribe: Adds users to newsletter with preferences
// - unsubscribe: Removes users from newsletter distribution
// - checkSubscription: Verifies subscription status by email
//
// Content Management (Admin/Leader only):
// - createNewsletter: Creates new newsletter issues
// - getAllNewsletters: Lists all newsletter issues
// - getNewsletter: Retrieves specific newsletter by ID
//
// Handles both subscriber management and newsletter content creation.
const Newsletter = require("../models/Newsletter");

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email, firstName, lastName, preferences } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const subscription = await Newsletter.subscribe(email, firstName, lastName, preferences);

    if (subscription.alreadySubscribed) {
      return res.json({
        success: true,
        message: "You are already subscribed to our newsletter",
        subscription,
      });
    }

    if (subscription.reactivated) {
      return res.json({
        success: true,
        message: "Your subscription has been reactivated",
        subscription,
      });
    }

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter",
      subscription,
    });
  } catch (error) {
    console.error("Error in subscribe:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while subscribing to newsletter",
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const unsubscribed = await Newsletter.unsubscribe(email);

    if (!unsubscribed) {
      return res.status(404).json({
        success: false,
        message: "Email not found in our subscription list or already unsubscribed",
      });
    }

    res.json({
      success: true,
      message: "Successfully unsubscribed from the newsletter",
    });
  } catch (error) {
    console.error("Error in unsubscribe:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while unsubscribing from newsletter",
    });
  }
};

// Check subscription status
exports.checkSubscription = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const subscriptionStatus = await Newsletter.checkSubscription(email);

    res.json({
      success: true,
      isSubscribed: subscriptionStatus.isSubscribed,
      subscription: subscriptionStatus.subscription,
    });
  } catch (error) {
    console.error("Error in checkSubscription:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while checking subscription status",
    });
  }
};

// Create a newsletter (admin/leader only)
exports.createNewsletter = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "admin" && userRole !== "leader") {
      return res.status(403).json({
        success: false,
        message: "Only admins and leaders can create newsletters",
      });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const newsletter = await Newsletter.createNewsletter(title, content, req.user.id);

    res.status(201).json({
      success: true,
      message: "Newsletter created successfully",
      newsletter,
    });
  } catch (error) {
    console.error("Error in createNewsletter:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating newsletter",
    });
  }
};

// Get all newsletters (admin/leader only)
exports.getAllNewsletters = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "admin" && userRole !== "leader") {
      return res.status(403).json({
        success: false,
        message: "Only admins and leaders can view all newsletters",
      });
    }

    const newsletters = await Newsletter.getAllNewsletters();

    res.json({
      success: true,
      newsletters,
    });
  } catch (error) {
    console.error("Error in getAllNewsletters:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching newsletters",
    });
  }
};

// Get newsletter by ID (admin/leader only)
exports.getNewsletter = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== "admin" && userRole !== "leader") {
      return res.status(403).json({
        success: false,
        message: "Only admins and leaders can view newsletter details",
      });
    }

    const newsletterId = req.params.id;
    const newsletter = await Newsletter.getNewsletterById(newsletterId);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    res.json({
      success: true,
      newsletter,
    });
  } catch (error) {
    console.error("Error in getNewsletter:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching newsletter",
    });
  }
};