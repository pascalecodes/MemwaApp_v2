const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const captureController = require("../controllers/capture");
const findController = require("../controllers/find");
const upload = require("../middleware/multer");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", ensureGuest, homeController.getIndex);
router.get("/home", ensureAuth, homeController.getHome);

router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/profile/edit", ensureAuth, postsController.editProfile)
router.put("/profile/edit/:id", ensureAuth, postsController.updateProfile)
router.post("/uploadAvatar", upload.single("avatar"), postsController.uploadAvatar)

router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.get("/watch", ensureAuth, homeController.getVideo)
router.post("/signup", authController.postSignup);
router.get("/find", ensureAuth, findController.findPost)
router.post("/find", ensureAuth, findController.findPost)

module.exports = router;
