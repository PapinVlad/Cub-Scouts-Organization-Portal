// Obanshire Cub Scouts API Server
//
// Server Configuration:
// - Uses Express with CORS, JSON parsing, and static file serving
// - Serves uploaded files and thumbnails from public directories
// - Tests database connection before initializing routes
// - Implements global error handling middleware
//
// API Routes:
// - /api/announcements: Public and admin announcement management
// - /api/auth: User authentication and registration
// - /api/photo-tags: Photo categorization system
// - /api/badges: Badge definition and management
// - /api/admin: Administrative functions (protected)
// - /api/achievements: Badge achievement tracking (protected)
// - /api/events: Event management and registration
// - /api/helpers: Helper/volunteer management (protected)
// - /api/photos: Photo gallery and uploads
// - /api/notifications: User notification system (protected)
// - /api/newsletters: Newsletter subscription management (protected)
//
// Features graceful error handling for route registration failures.
// Some communication features (messages, group conversations) are disabled.
const express = require("express");
const cors = require("cors");
const path = require("path");
const { testConnection } = require("./config/db");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/uploads/thumbnails", express.static(path.join(__dirname, "public", "uploads", "thumbnails")));

const initializeServer = async () => {
  const dbConnected = await testConnection();

  try {

    const announcementRoutes = require("./routes/announcementRoutes");
    app.use("/api/announcements", announcementRoutes);

    const authRoutes = require("./routes/authRoutes");
    app.use("/api/auth", authRoutes);

    try {
      const photoTagRoutes = require("./routes/photoTagRoutes");
      app.use("/api/photo-tags", photoTagRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/photo-tags", error.message);
    }


    try {
      const badgeRoutes = require("./routes/badgeRoutes");
      app.use("/api/badges",  badgeRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/badges", error.message);
    }

    try {
      const adminRoutes = require("./routes/adminRoutes");
      app.use("/api/admin", auth, adminRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/admin", error.message);
    }

    try {
      const badgeAchievementRoutes = require("./routes/badgeAchievementRoutes");
      app.use("/api/achievements", auth, badgeAchievementRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/achievements", error.message);
    }

    try {
      const eventRoutes = require("./routes/eventRoutes");
      app.use("/api/events",  eventRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/events", error.message);
    }

    try {
      const helperRoutes = require("./routes/helperRoutes");
      app.use("/api/helpers", auth, helperRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/helpers", error.message);
    }

    try {
      const photoRoutes = require("./routes/photoRoutes");
      app.use("/api/photos", photoRoutes); 
    } catch (error) {
      console.error("Failed to register route: /api/photos", error.message);
    }

   

    try {
      const notificationRoutes = require("./routes/notificationRoutes");
      app.use("/api/notifications", auth, notificationRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/notifications", error.message);
    }

    

    try {
      const newsletterRoutes = require("./routes/newsletterRoutes");
      app.use("/api/newsletters", auth, newsletterRoutes);
    } catch (error) {
      console.error("Failed to register route: /api/newsletters", error.message);
    }
  } catch (error) {
    console.error("Error registering routes:", error);
  }

  app.get("/", (req, res) => {
    res.send("Obanshire Cub Scouts API is running");
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!dbConnected) {
      console.warn("WARNING: Database connection failed. Some features may not work correctly.");
    } else {
      console.log("Database connection established successfully.");
    }
  });
};

initializeServer();