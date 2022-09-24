const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  tokens: [{ type: Object }],
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing,cannot compare");

  try {
    const result = await bcrypt.compare(password, this.password);

    return result;
  } catch (err) {
    console.log("Error inside comparePassword", err.message);
  }
};

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Email is required");
  try {
    const user = await this.findOne({ email });
    if (user) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("Error inside isThisEmailInUse", err.message);
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);

// exports.uploadProfile = async (req, res) => {
//   const { user } = req;
//   if (!user)
//     return res.status(401).json({
//       sucsess: false,
//       message: "Unauthorized Access",
//     });

//   try {
//     const profileBuffer = req.file.buffer;
//     const { width, height } = await sharp(profileBuffer).metadata();
//     const finalProfile = await sharp(profileBuffer)
//       .resize(Math.round(width * 0.5), Math.round(height * 0.5))
//       .toBuffer();
//     await User.findByIdAndUpdate(user._id, {
//       avatar: finalProfile,
//     });
//     console.log(finalProfile);
//     res.status(202).json({
//       sucsess: true,
//       message: "Profile updated successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       sucsess: false,
//       message: "Internal Server Error",
//     });
//     console.log(error.message);
//   }
// }
