// JWT Authentication Middleware
//
// Core Functionality:
// - Validates JWT tokens from request headers
// - Bypasses authentication for public paths
// - Attaches decoded user data to request object
// - Provides specific error responses for different token issues
//
// Public paths include login, registration, and announcement endpoints.
// Handles token expiration and validation errors with appropriate status codes.
const jwt = require("jsonwebtoken")

// JWT secret key (in production, this should be in environment variables)
const JWT_SECRET = "obanshire_cubs_secret_key"

module.exports = (req, res, next) => {

  const publicPaths = ["/auth/login", "/auth/register", "/announcements", "/announcements/"]

  const isPublicPath = publicPaths.some((path) => req.path === path || req.path.startsWith("/announcements/"))

  if (isPublicPath) {
    return next()
  }

  const token = req.header("x-auth-token") || req.header("authorization")?.replace("Bearer ", "")


  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)


    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      })
    }

    req.user = decoded
    next()
  } catch (error) {
    console.error("Token verification error:", error)

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    res.status(401).json({
      success: false,
      message: "Token is not valid",
    })
  }
}
