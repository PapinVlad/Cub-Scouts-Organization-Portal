// Photo Routes
//
// File Upload Configuration:
// - Uses multer for image handling with 5MB size limit
// - Creates upload and thumbnail directories if needed
// - Generates unique filenames with timestamps
// - Restricts uploads to image files only
//
// Public Routes:
// - GET /: Retrieves all photos with role-based filtering
// - GET /public: Fetches only publicly visible photos
// - GET /:id: Gets specific photo with permission checks
// - GET /event/:eventId: Lists photos for specific events
// - GET /tag/:tag: Finds photos with specific tags
//
// Protected Routes (auth middleware + file upload):
// - POST /: Uploads new photos with metadata
// - PUT /:id: Updates existin
const express = require("express")
const router = express.Router()
const photoController = require("../controllers/photoController")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")
const fs = require("fs")


const uploadDir = path.join(__dirname, "..", "public", "uploads")
const thumbnailDir = path.join(uploadDir, "thumbnails")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `photo-${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
})

// Public routes
router.get("/", photoController.getPhotos)
router.get("/public", photoController.getPublicPhotos)
router.get("/:id", photoController.getPhotoById)
router.get("/event/:eventId", photoController.getPhotosByEvent)
router.get("/tag/:tag", photoController.getPhotosByTag)

// Protected routes
router.post("/", auth, upload.single("image"), photoController.addPhoto)
router.put("/:id", auth, upload.single("image"), photoController.updatePhoto);
router.delete("/:id", auth, photoController.deletePhoto);

module.exports = router
