// Photo Tag Management API
//
// Category Operations:
// - getAllTagCategories: Retrieves all categories with their associated tags
// - getDirectCategories: Fetches category list without associated tags
// - addTagCategory: Creates new tag categories
// - deleteTagCategory: Removes categories and their associated tags (with transaction)
//
// Tag Operations:
// - getAllTags: Lists all tags across all categories
// - getDirectTags: Retrieves tags for a specific category
// - addTag: Creates new tags within categories
// - deleteTag: Removes specific tags
//
// Includes database connection validation and comprehensive error handling.
const db = require("../config/db")

exports.getAllTagCategories = async (req, res) => {
  try {

    try {
      await db.query("SELECT 1")
      console.log("Database connection is working")
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return res.status(500).json({
        success: false,
        message: "Database connection error",
        error: dbError.message,
      })
    }

    try {
      const [tables] = await db.query(`
        SHOW TABLES LIKE 'photo_tag_categories'
      `)

      if (tables.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: "No tag categories found (table does not exist)",
        })
      }
    } catch (tableError) {
      console.error("Error checking for table photo_tag_categories:", tableError)
      return res.status(500).json({
        success: false,
        message: "Error checking for table photo_tag_categories",
        error: tableError.message,
      })
    }

    let categories = []
    try {
      const [result] = await db.query(`
        SELECT category_id, name
        FROM photo_tag_categories
        ORDER BY name
      `)
      categories = result
    } catch (categoriesError) {
      console.error("Error fetching categories:", categoriesError)
      return res.status(500).json({
        success: false,
        message: "Error fetching categories",
        error: categoriesError.message,
      })
    }

    // Для каждой категории получаем теги
    const result = []

    for (const category of categories) {
      try {
        const [tags] = await db.query(
          `
          SELECT tag_id, tag
          FROM predefined_photo_tags
          WHERE category_id = ?
          ORDER BY tag
        `,
          [category.category_id],
        )


        result.push({
          category_id: category.category_id,
          category_name: category.name, 
          tags: tags,
        })
      } catch (tagsError) {
        console.error(`Error fetching tags for category ${category.category_id}:`, tagsError)
        result.push({
          category_id: category.category_id,
          category_name: category.name,
          tags: [],
          error: tagsError.message,
        })
      }
    }


    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Error in getAllTagCategories:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch tag categories",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
}

exports.getAllTags = async (req, res) => {
  try {

    const [tables] = await db.query(`
      SHOW TABLES LIKE 'predefined_photo_tags'
    `)

    if (tables.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No tags found (table does not exist)",
      })
    }

    const [tags] = await db.query(`
      SELECT tag_id, tag, category_id
      FROM predefined_photo_tags
      ORDER BY tag
    `)

    console.log(`Found ${tags.length} tags`)

    res.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    console.error("Error in getAllTags:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
      error: error.message,
    })
  }
}

exports.getDirectCategories = async (req, res) => {
  try {

    const [categories] = await db.query(`
      SELECT category_id, name
      FROM photo_tag_categories
      ORDER BY name
    `)


    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error in getDirectCategories:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch direct categories",
      error: error.message,
    })
  }
}

exports.getDirectTags = async (req, res) => {
  try {
    const { categoryId } = req.params

    const [tags] = await db.query(
      `
      SELECT tag_id, tag, category_id
      FROM predefined_photo_tags
      WHERE category_id = ?
      ORDER BY tag
    `,
      [categoryId],
    )


    res.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    console.error("Error in getDirectTags:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch direct tags",
      error: error.message,
    })
  }
}

exports.addTagCategory = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      })
    }

    const [result] = await db.query("INSERT INTO photo_tag_categories (name) VALUES (?)", [name])

    res.status(201).json({
      success: true,
      data: {
        category_id: result.insertId,
        name,
      },
      message: "Tag category added successfully",
    })
  } catch (error) {
    console.error("Error in addTagCategory:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add tag category",
      error: error.message,
    })
  }
}

exports.addTag = async (req, res) => {
  try {
    const { category_id, tag } = req.body

    if (!category_id || !tag) {
      return res.status(400).json({
        success: false,
        message: "Category ID and tag are required",
      })
    }

    const [categories] = await db.query("SELECT * FROM photo_tag_categories WHERE category_id = ?", [category_id])

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    const [existingTags] = await db.query("SELECT * FROM predefined_photo_tags WHERE category_id = ? AND tag = ?", [
      category_id,
      tag,
    ])

    if (existingTags.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Tag already exists in this category",
      })
    }

    const [result] = await db.query("INSERT INTO predefined_photo_tags (category_id, tag) VALUES (?, ?)", [
      category_id,
      tag,
    ])

    res.status(201).json({
      success: true,
      data: {
        tag_id: result.insertId,
        category_id,
        tag,
      },
      message: "Tag added successfully",
    })
  } catch (error) {
    console.error("Error in addTag:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add tag",
      error: error.message,
    })
  }
}

exports.deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params

    const [tags] = await db.query("SELECT * FROM predefined_photo_tags WHERE tag_id = ?", [tagId])

    if (tags.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      })
    }

    await db.query("DELETE FROM predefined_photo_tags WHERE tag_id = ?", [tagId])

    res.json({
      success: true,
      message: "Tag deleted successfully",
    })
  } catch (error) {
    console.error("Error in deleteTag:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete tag",
      error: error.message,
    })
  }
}

exports.deleteTagCategory = async (req, res) => {
  try {
    const { categoryId } = req.params

    const [categories] = await db.query("SELECT * FROM photo_tag_categories WHERE category_id = ?", [categoryId])

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    await db.query("START TRANSACTION")

    try {
      await db.query("DELETE FROM predefined_photo_tags WHERE category_id = ?", [categoryId])

      await db.query("DELETE FROM photo_tag_categories WHERE category_id = ?", [categoryId])

      await db.query("COMMIT")

      res.json({
        success: true,
        message: "Category and all its tags deleted successfully",
      })
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Error in deleteTagCategory:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete tag category",
      error: error.message,
    })
  }
}
