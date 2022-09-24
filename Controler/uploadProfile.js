const cloudinary = require("../helper/imageUpload");
const User = require("../models/user");

exports.uploadProfile = async (req, res) => {
  const { user } = req;

  if (!user)
    return res.status(401).json({
      sucsess: false,
      message: "Unauthorized Access",
    });
  // console.log(req.file)

  // console.log(result)
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    await User.findByIdAndUpdate(user._id, {
      avatar: result.url,
    });
    console.log(result);
    res.status(202).json({
      sucsess: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      sucsess: false,
      message: "Internal Server Error",
    });
    console.log(error.message);
  }
};
