const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const captureController = require("../controllers/capture");
const findController = require("../controllers/find");
const { ensureAuth, ensureGuest } = require("../middleware/auth");


router.get("/", findController.getSearch)
router.post("/", findController.postSearch)

module.exports = router;