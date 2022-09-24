const express = require("express"); // first initilize express
const { IsAuth } = require("../midalware/Auth");
const router = express.Router();
const {
  validateUserSignUp,
  validationMessage,
  userSignInValidator,
} = require("../midalware/Validator");

const { createUser, userSignIn, userSignOut } = require("../models/CreateUser");
const sharp = require("sharp");
const multer = require("multer");
const User = require("../models/user");
const cloudinary = require("../helper/imageUpload");
const { uploadProfile } = require("../Controler/uploadProfile");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images", false);
  }
};
const uploads = multer({ storage, fileFilter });

//................................'''''''''''''''''.....................

router.post("/create-user", validateUserSignUp, validationMessage, createUser);

router.post("/sign-in", userSignInValidator, validationMessage, userSignIn);
router.post("/sign-out", IsAuth, userSignOut);

router.post(
  "/upload-profile",
  IsAuth,
  uploads.single("profile"),
  uploadProfile
);

router.get("/profile", IsAuth, (req, resp) => {
  if (!req.user) {
    return resp.json({ sucsess: false, message: "unauthorized access!" });
  }
  resp.json({
    sucsess: true,
    profile: {
      fullname: req.user.fullname,
      email: req.user.email,
      avatar: req.user.avatar ? req.user.avatar : "",
    },
  });
});

module.exports = router;
