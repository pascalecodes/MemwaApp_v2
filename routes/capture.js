const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const captureController = require("../controllers/capture");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureAuth, captureController.getCapture);
router.post("/upload", upload.single("videoBlob"), captureController.createVideoPost)
router.post("/createPost", upload.single("videoBlob"), captureController.createPost)
module.exports = router;