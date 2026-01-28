// Photo Management API
//
// Core Photo Operations:
// - getPhotos: Retrieves all photos with role-based visibility filtering
// - getPublicPhotos: Fetches only publicly visible photos
// - getPhotoById: Gets specific photo with permission checks
// - addPhoto: Uploads new photos with metadata and generates thumbnails
// - updatePhoto: Modifies existing photos and their metadata
// - deletePhoto: Removes photos and their associated files
//
// Filtering & Organization:
// - getPhotosByEvent: Retrieves photos associated with specific events
// - getPhotosByTag: Fetches photos matching specific tags
//
// Utility Functions:
// - generateThumbnail: Creates optimized thumbnail images
// - updateThumbnailPathInDB: Updates database with thumbnail locations
// - ensureDirectoryExists: Manages upload directory structure
//
// Handles image uploads, thumbnails, metadata, and role-based access control.
const Photo = require("../models/Photo");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const db = require("../config/db"); 

const UPLOADS_DIR = path.join(__dirname, "..", "public", "uploads");
const THUMBNAILS_DIR = path.join(__dirname, "..", "public", "uploads", "thumbnails");
const THUMBNAIL_WIDTH = 300; 

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
};

const generateThumbnail = async (filePath, thumbnailPath, mimeType) => {
  try {
    console.log(`Generating thumbnail for: ${filePath}`);

    let format = "jpeg";
    let options = { quality: 90 };

    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
      format = "jpeg";
      options = { quality: 90 };
    } else if (mimeType === "image/png") {
      format = "png";
      options = {};
    } else if (mimeType === "image/webp") {
      format = "webp";
      options = { quality: 90 };
    } else if (mimeType === "image/gif") {
      format = "gif";
      options = {};
    } else {
      throw new Error(`Unsupported image format: ${mimeType}`);
    }

    await sharp(filePath)
      .resize(THUMBNAIL_WIDTH) 
      .sharpen() 
      .toFormat(format, options)
      .toFile(thumbnailPath);

    console.log(`Thumbnail created: ${thumbnailPath} in ${format} format`);
    return true;
  } catch (error) {
    console.error(`Error generating thumbnail for ${filePath}:`, error);
    return false;
  }
};

const updateThumbnailPathInDB = async (photoId, thumbnailPath) => {
  try {
    const relativePath = thumbnailPath.replace(path.join(__dirname, "..", "public"), "");

    console.log(`Updating thumbnail path for photo ID ${photoId}: ${relativePath}`);

    const [result] = await db.pool.execute("UPDATE photos SET thumbnail_url = ? WHERE photo_id = ?", [
      relativePath,
      photoId,
    ]);

    console.log(`Database updated for photo ID ${photoId}: ${result.affectedRows} row(s) affected`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating thumbnail path in database for photo ID ${photoId}:`, error);
    return false;
  }
};

// Get all photos
exports.getPhotos = async (req, res) => {
  try {
    const includePrivate = req.user && (req.user.role === "admin" || req.user.role === "leader");
    const photos = await Photo.getAllPhotos(includePrivate);

    res.json({
      success: true,
      data: photos,
      message: "Photos retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getPhotos controller:", error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Server error while fetching photos",
    });
  }
};

// Get public photos
exports.getPublicPhotos = async (req, res) => {
  try {
    const photos = await Photo.getAllPhotos(false);

    res.json({
      success: true,
      data: photos,
      message: "Public photos retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getPublicPhotos controller:", error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Server error while fetching public photos",
    });
  }
};

// Get photo by ID
exports.getPhotoById = async (req, res) => {
  try {
    const photoId = req.params.id;
    const photo = await Photo.getPhotoById(photoId);

    if (!photo) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Photo not found",
      });
    }

    // Check if photo is private and user is not admin/leader
    if (!photo.public_visible && (!req.user || (req.user.role !== "admin" && req.user.role !== "leader"))) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "You don't have permission to view this photo",
      });
    }

    res.json({
      success: true,
      data: photo,
      message: "Photo retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getPhotoById controller:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Server error while fetching photo",
    });
  }
};

// Add new photo
exports.addPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "No image file provided",
      });
    }

    const { title, description, event_id, public_visible, leaders_only_visible, tags } = req.body;
    const filename = req.file.filename;

    const uploadsDir = path.join(__dirname, "..", "public", "uploads");
    const imagePath = path.join(uploadsDir, filename);

    const thumbnailDir = path.join(__dirname, "..", "public", "uploads", "thumbnails");
    const thumbnailPath = path.join(thumbnailDir, filename);

    // Создание директорий
    ensureDirectoryExists(uploadsDir);
    ensureDirectoryExists(thumbnailDir);

    // Перемещение загруженного файла
    fs.renameSync(req.file.path, imagePath);

    // Генерация миниатюры с динамическим форматом
    const success = await generateThumbnail(imagePath, thumbnailPath, req.file.mimetype);
    if (!success) {
      throw new Error("Failed to generate thumbnail");
    }

    // Создание данных фотографии
    const photoData = {
      title: title || "Untitled",
      description: description || "",
      image_url: `/uploads/${filename}`,
      thumbnail_url: `/uploads/thumbnails/${filename}`,
      uploaded_by: req.user.id,
      event_id: event_id ? parseInt(event_id, 10) : null,
      public_visible: public_visible === "true" ? 1 : 0,
      leaders_only_visible: leaders_only_visible === "true" ? 1 : 0,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    };

    // Сохранение в базе данных
    const result = await Photo.addPhoto(photoData);
    if (!result || !result.photo_id) {
      throw new Error("Failed to save photo in database");
    }

    // Обновление пути к миниатюре в базе данных
    await updateThumbnailPathInDB(result.photo_id, thumbnailPath);

    res.status(201).json({
      success: true,
      data: result,
      message: "Photo uploaded successfully",
    });
  } catch (error) {
    console.error("Error in addPhoto controller:", error);

    const filename = req.file ? req.file.filename : null;
    if (filename) {
      const imagePath = path.join(__dirname, "..", "public", "uploads", filename);
      const thumbnailPath = path.join(__dirname, "..", "public", "uploads", "thumbnails", filename);
      try {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
      } catch (unlinkError) {
        console.error("Error cleaning up files after failed upload:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to upload photo: " + error.message,
    });
  }
};

// Update photo
exports.updatePhoto = async (req, res) => {
  try {
    const photoId = req.params.id;
    const { title, description, event_id, public_visible, leaders_only_visible, tags } = req.body;

    const existingPhoto = await Photo.getPhotoById(photoId);

    if (!existingPhoto) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Photo not found",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "leader" && existingPhoto.uploaded_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "You don't have permission to update this photo",
      });
    }

    const updateData = {
      title: title || existingPhoto.title,
      description: description || existingPhoto.description,
      image_url: existingPhoto.image_url,
      thumbnail_url: existingPhoto.thumbnail_url,
      event_id: event_id || existingPhoto.event_id,
      public_visible: public_visible !== undefined ? (public_visible === "true" ? 1 : 0) : existingPhoto.public_visible,
      leaders_only_visible:
        leaders_only_visible !== undefined
          ? leaders_only_visible === "true" ? 1 : 0
          : existingPhoto.leaders_only_visible,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : existingPhoto.tags,
    };

    if (req.file) {
      const filename = req.file.filename;
      const newImagePath = path.join(__dirname, "..", "public", "uploads", filename);
      const newThumbnailPath = path.join(__dirname, "..", "public", "uploads", "thumbnails", filename);

      // Удаление старых файлов
      try {
        const oldImagePath = path.join(__dirname, "..", "public", "uploads", existingPhoto.image_url.split("/").pop());
        const oldThumbnailPath = existingPhoto.thumbnail_url
          ? path.join(__dirname, "..", "public", "uploads", "thumbnails", existingPhoto.thumbnail_url.split("/").pop())
          : null;
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        if (oldThumbnailPath && fs.existsSync(oldThumbnailPath)) fs.unlinkSync(oldThumbnailPath);
      } catch (unlinkError) {
        console.error("Error deleting old files during update:", unlinkError);
      }

      // Перемещение нового файла
      fs.renameSync(req.file.path, newImagePath);

      // Генерация новой миниатюры
      const success = await generateThumbnail(newImagePath, newThumbnailPath, req.file.mimetype);
      if (!success) {
        throw new Error("Failed to generate thumbnail");
      }

      updateData.image_url = `/uploads/${filename}`;
      updateData.thumbnail_url = `/uploads/thumbnails/${filename}`;

      // Обновление пути к миниатюре в базе данных
      await updateThumbnailPathInDB(photoId, newThumbnailPath);
    }

    const result = await Photo.updatePhoto(photoId, updateData);

    res.json({
      success: true,
      data: result,
      message: "Photo updated successfully",
    });
  } catch (error) {
    console.error("Error in updatePhoto controller:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: "Failed to update photo: " + error.message,
    });
  }
};

// Delete photo
// Delete photo
exports.deletePhoto = async (req, res) => {
  try {
    const photoId = req.params.id;

    const existingPhoto = await Photo.getPhotoById(photoId);

    if (!existingPhoto) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "leader" && existingPhoto.uploaded_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this photo",
      });
    }

    // Удаление записи из базы данных
    await Photo.deletePhoto(photoId);

    // Формирование путей к файлам
    const imageFileName = path.basename(existingPhoto.image_url); // Извлекаем только имя файла
    const thumbnailFileName = existingPhoto.thumbnail_url ? path.basename(existingPhoto.thumbnail_url) : null;

    const imagePath = path.join(UPLOADS_DIR, imageFileName);
    const thumbnailPath = thumbnailFileName ? path.join(THUMBNAILS_DIR, thumbnailFileName) : null;

    // Удаление файлов
    let fileDeletionErrors = [];

    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } else {
        console.warn(`Image file not found: ${imagePath}`);
      }
    } catch (unlinkError) {
      console.error(`Error deleting image file ${imagePath}:`, unlinkError);
      fileDeletionErrors.push(`Failed to delete image file: ${imageFileName}`);
    }

    try {
      if (thumbnailPath && fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
        console.log(`Deleted thumbnail file: ${thumbnailPath}`);
      } else if (thumbnailPath) {
        console.warn(`Thumbnail file not found: ${thumbnailPath}`);
      }
    } catch (unlinkError) {
      console.error(`Error deleting thumbnail file ${thumbnailPath}:`, unlinkError);
      fileDeletionErrors.push(`Failed to delete thumbnail file: ${thumbnailFileName}`);
    }

    // Формирование ответа
    if (fileDeletionErrors.length > 0) {
      res.json({
        success: true,
        message: "Photo deleted successfully, but some files could not be removed: " + fileDeletionErrors.join("; "),
      });
    } else {
      res.json({
        success: true,
        message: "Photo and associated files deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error in deletePhoto controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete photo: " + error.message,
    });
  }
};

// Get photos by event
exports.getPhotosByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    console.log(`Getting photos for event ID: ${eventId}`);
    const photos = await Photo.getPhotosByEvent(eventId);

    res.json({
      success: true,
      data: photos,
      message: "Event photos retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getPhotosByEvent controller:", error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Server error while fetching event photos",
    });
  }
};

// Get photos by tag
exports.getPhotosByTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const photos = await Photo.getPhotosByTag(tag);

    res.json({
      success: true,
      data: photos,
      message: "Tagged photos retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getPhotosByTag controller:", error);
    res.status(500).json({
      success: false,
      data: [],
      message: "Server error while fetching tagged photos",
    });
  }
};