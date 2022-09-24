const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.IsAuth = async (req, res, next) => {
  //   console.log(req.headers.authorization);

  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_MESSAGE);
      const user = await User.findById(decode.userId);
      if (!user) {
        res.json({
          sucsess: false,
          message: "Unauthorized Access",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        res.json({
          sucsess: false,
          message: "Unauthorized Access",
        });
      }
      if (error.name === "TokenExpiredError") {
        res.json({
          sucsess: false,
          message: "Session Expired",
        });
      }

      res.json({
        sucsess: false,
        message: "Internal Server Error",
      });
    }
  } else {
    res.json({
      sucsess: false,
      message: "Unauthorized Access",
    });
  }
};
