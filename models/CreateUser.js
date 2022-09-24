const express = require("express"); // first initilize express
const jwt = require("jsonwebtoken");

const User = require("./user");

// ...........................''''''''SignUP Controler''''''''................................
exports.createUser = async (req, res) => {
  const { fullname, email, password, confirmPassword, avatar } = req.body;
  console.log(req.body);

  //.........................""""" """""""..............
  const isNewUser = await User.isThisEmailInUse(email);
  console.log(isNewUser);
  if (!isNewUser) {
    return res.json({
      sucsess: false,
      message: "Email is already in use",
    });
  }

  //.........................///.........
  const user = await User({
    fullname: fullname,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    avatar: avatar,
  });

  //................................./////....
  await user.save();
  res.json({ sucsess: true, user });
};

//.........................................''LogIn Controler''.......................

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  //to find sign in user to the database using email
  const user = await User.findOne({ email: email });
  if (!user) return res.json({ sucsess: false, message: "User not found" }); //check

  //if user founded then compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({ sucsess: false, message: "Email/Password is wrong" }); //check

  // Create user token

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_MESSAGE, {
    expiresIn: "1h",
  });

  let older_tokens = user.tokens || [];

  if (older_tokens) {
    older_tokens = older_tokens.filter((token) => {
      const time_diff = (Date.now() - parseInt(token.signedAt)) / 1000;
      if (time_diff < 86400) {
        return token;
      }
    });
  }

  const findByIdUp = await User.findByIdAndUpdate(user._id, {
    tokens: [
      ...older_tokens,
      {
        token,
        signedAt: Date.now().toString(),
      },
    ],
  });

  console.log(findByIdUp);
  // if user founded and password is correct then send user data and token
  res.json({ sucsess: true, user, token });
};

exports.userSignOut = async (req, resp) => {
  console.log(req.headers);
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return resp
        .status(400)
        .json({ sucsess: false, message: "Authorization fail" });
    }

    const tokens = req.user.tokens;
    const newToken = tokens.filter((t) => t.token !== token);
    await User.findByIdAndUpdate(req.user._id, { tokens: newToken });
    resp.json({ sucsess: true, message: "Sign Out Successfully " });
  }
};
