const mysql = require("mysql2/promise")

// MySQL connection pool (hardcoded as per requirements)
const pool = mysql.createPool({
  host: "localhost",
  user: "vla", 
  password: "VnTbOZjfKnfuaew2", 
  database: "ocs",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Test the connection
const testConnection = async () => {
  let retries = 5
  let connected = false

  while (retries > 0 && !connected) {
    try {
      const connection = await pool.getConnection()
      console.log("MySQL Connected...")
      connection.release()
      connected = true
      return true
    } catch (err) {
      console.error(`MySQL connection error (${retries} retries left):`, err.message)
      retries--
      if (retries === 0) {
        console.error("Failed to connect to MySQL after multiple attempts")
        return false
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return connected
}

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj) return null

  const newObj = {}
  Object.keys(obj).forEach((key) => {
    const newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    newObj[newKey] = obj[key]
  })

  
  if (newObj.userId) {
    newObj.id = newObj.userId
    delete newObj.userId
  }

  return newObj
}

// Export the pool, test function, and helper function
const getConnection = async () => {
  try {
    return await pool.getConnection()
  } catch (error) {
    console.error("Error getting connection from pool:", error)
    throw error
  }
}

// Export the pool, test function, helper function, and getConnection method
module.exports = {
  pool,
  testConnection,
  toCamelCase,
  getConnection,
  query: pool.query.bind(pool),
}




