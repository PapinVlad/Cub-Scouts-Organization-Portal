
// Newsletter Routes
//
// Public Routes:
// - POST /subscribe: Adds users to newsletter distribution
// - POST /unsubscribe: Removes users from newsletter
// - GET /check-subscription: Verifies subscription status
//
// Protected Routes (auth middleware applied globally after public routes):
// - POST /: Creates new newsletter issues
// - GET /: Lists all newsletter issues
// - GET /:id: Retrieves specific newsletter by ID
//
// Uses router.use(auth) pattern to protect all routes after public endpoints.
const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");
const auth = require("../middleware/auth");


router.post("/subscribe", newsletterController.subscribe);


router.post("/unsubscribe", newsletterController.unsubscribe);


router.get("/check-subscription", newsletterController.checkSubscription);

router.use(auth);


router.post("/", newsletterController.createNewsletter);


router.get("/", newsletterController.getAllNewsletters);


router.get("/:id", newsletterController.getNewsletter);

module.exports = router;