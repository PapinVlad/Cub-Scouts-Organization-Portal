// Newsletter Management Model
//
// Subscription Operations:
// - subscribe: Adds or reactivates users with preference settings
// - unsubscribe: Deactivates user subscriptions
// - checkSubscription: Verifies subscription status by email
// - getActiveSubscribers: Lists all current subscribers with preferences
//
// Content Management:
// - createNewsletter: Creates new newsletter issues
// - getAllNewsletters: Lists all newsletter issues with creator info
// - getNewsletterById: Retrieves specific newsletter by ID
// - markAsSent: Updates newsletter status after distribution
//
// Handles both subscriber management and newsletter content creation with preference-based targeting.
const { pool } = require("../config/db");

class Newsletter {
  // Subscribe to newsletter
  static async subscribe(email, firstName = null, lastName = null, preferences = {}) {
    try {
      const { events = true, badges = true, general = true } = preferences;

      const [existingCheck] = await pool.execute(
        `SELECT * FROM newsletter_subscriptions
        WHERE email = ?`,
        [email]
      );

      if (existingCheck.length > 0) {
        if (!existingCheck[0].is_active) {
          await pool.execute(
            `UPDATE newsletter_subscriptions
            SET is_active = TRUE, unsubscribed_at = NULL, 
                pref_events = ?, pref_badges = ?, pref_general = ?
            WHERE email = ?`,
            [events ? 1 : 0, badges ? 1 : 0, general ? 1 : 0, email]
          );
          return {
            subscriptionId: existingCheck[0].subscription_id,
            email,
            firstName,
            lastName,
            preferences: { events, badges, general },
            reactivated: true,
          };
        }
        return {
          subscriptionId: existingCheck[0].subscription_id,
          email,
          alreadySubscribed: true,
        };
      }

      const [result] = await pool.execute(
        `INSERT INTO newsletter_subscriptions 
        (email, first_name, last_name, pref_events, pref_badges, pref_general)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          email,
          firstName,
          lastName,
          events ? 1 : 0,
          badges ? 1 : 0,
          general ? 1 : 0,
        ]
      );

      const [newSubscription] = await pool.execute(
        `SELECT * FROM newsletter_subscriptions WHERE subscription_id = ?`,
        [result.insertId]
      );

      return {
        subscriptionId: result.insertId,
        email,
        firstName,
        lastName,
        preferences: {
          events: newSubscription[0].pref_events === 1,
          badges: newSubscription[0].pref_badges === 1,
          general: newSubscription[0].pref_general === 1,
        },
      };
    } catch (error) {
      console.error("Error in Newsletter.subscribe:", error.message);
      throw new Error(`Failed to subscribe: ${error.message}`);
    }
  }

  // Unsubscribe from newsletter
  static async unsubscribe(email) {
    try {
      const [result] = await pool.execute(
        `UPDATE newsletter_subscriptions
        SET is_active = FALSE, unsubscribed_at = CURRENT_TIMESTAMP
        WHERE email = ? AND is_active = TRUE`,
        [email]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in Newsletter.unsubscribe:", error.message);
      throw new Error(`Failed to unsubscribe: ${error.message}`);
    }
  }

  // Check subscription status
  static async checkSubscription(email) {
    try {
      const [rows] = await pool.execute(
        `SELECT subscription_id, email, first_name, last_name, is_active,
                pref_events, pref_badges, pref_general
        FROM newsletter_subscriptions
        WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) {
        return { isSubscribed: false };
      }

      const subscription = rows[0];
      return {
        isSubscribed: subscription.is_active === 1,
        subscription: {
          subscriptionId: subscription.subscription_id,
          email: subscription.email,
          firstName: subscription.first_name,
          lastName: subscription.last_name,
          preferences: {
            events: subscription.pref_events === 1,
            badges: subscription.pref_badges === 1,
            general: subscription.pref_general === 1,
          },
        },
      };
    } catch (error) {
      console.error("Error in Newsletter.checkSubscription:", error.message);
      throw new Error(`Failed to check subscription: ${error.message}`);
    }
  }

  // Create a newsletter
  static async createNewsletter(title, content, createdBy) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO newsletters (title, content, created_by, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [title, content, createdBy]
      );

      const [newsletter] = await pool.execute(
        `SELECT * FROM newsletters WHERE newsletter_id = ?`,
        [result.insertId]
      );

      return {
        newsletterId: result.insertId,
        title,
        content,
        createdBy,
        createdAt: newsletter[0].created_at,
      };
    } catch (error) {
      console.error("Error in Newsletter.createNewsletter:", error.message);
      throw new Error(`Failed to create newsletter: ${error.message}`);
    }
  }

  // Get all newsletters
  static async getAllNewsletters() {
    try {
      const [rows] = await pool.execute(
        `SELECT n.*, 
          CONCAT(u.first_name, ' ', u.last_name) as creator_name
        FROM newsletters n
        JOIN users u ON n.created_by = u.user_id
        ORDER BY n.created_at DESC`
      );
      return rows;
    } catch (error) {
      console.error("Error in Newsletter.getAllNewsletters:", error.message);
      throw new Error(`Failed to fetch newsletters: ${error.message}`);
    }
  }

  // Get newsletter by ID
  static async getNewsletterById(newsletterId) {
    try {
      const [rows] = await pool.execute(
        `SELECT n.*, 
          CONCAT(u.first_name, ' ', u.last_name) as creator_name
        FROM newsletters n
        JOIN users u ON n.created_by = u.user_id
        WHERE n.newsletter_id = ?`,
        [Number(newsletterId)]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error("Error in Newsletter.getNewsletterById:", error.message);
      throw new Error(`Failed to fetch newsletter: ${error.message}`);
    }
  }

  // Mark newsletter as sent
  static async markAsSent(newsletterId) {
    try {
      const [result] = await pool.execute(
        `UPDATE newsletters
        SET is_sent = TRUE, sent_at = CURRENT_TIMESTAMP
        WHERE newsletter_id = ?`,
        [Number(newsletterId)]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error in Newsletter.markAsSent:", error.message);
      throw new Error(`Failed to mark newsletter as sent: ${error.message}`);
    }
  }

  // Get all active subscribers
  static async getActiveSubscribers() {
    try {
      const [rows] = await pool.execute(
        `SELECT subscription_id, email, first_name, last_name,
                pref_events, pref_badges, pref_general
        FROM newsletter_subscriptions
        WHERE is_active = TRUE`
      );

      return rows.map((row) => ({
        subscriptionId: row.subscription_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        preferences: {
          events: row.pref_events === 1,
          badges: row.pref_badges === 1,
          general: row.pref_general === 1,
        },
      }));
    } catch (error) {
      console.error("Error in Newsletter.getActiveSubscribers:", error.message);
      throw new Error(`Failed to fetch active subscribers: ${error.message}`);
    }
  }
}

module.exports = Newsletter;