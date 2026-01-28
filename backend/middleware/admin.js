module.exports = (req, res, next) => {

  // Check if user is admin or leader
  if (req.user && (req.user.role === "admin" || req.user.role === "leader")) {
    next()
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admin or leader role required." })
  }
}
