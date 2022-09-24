const express = require("express"); // first initilize express
require("dotenv").config(); //import data base url
require("./models/db"); //import db from modal

const UserRoutes = require("./route/user");
const app = express();

// app.use((req, res, next) => {
//   req.on("data", (chunk) => {
//     const data = JSON.parse(chunk);
//     req.body = data;
//     next();
//   });
// });

app.use(express.json()); // this is Midele ware function
app.use(UserRoutes);

// const User = require("./models/user");

// const test = async (email, password) => {
//   const user = await User.findOne({ email: email });
//   const result = await user.comparePassword(password);
//   console.log(result);
// };

//  test("jawwadahmed123@gmail.com", "1234567890"); //this is for testing purpos

// app.get("/test", (req, res) => {
//   res.send("Hello World");
// });

// to show the root path
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the root path",

  })
});

// To show the port number
app.listen(8000, () => {
  console.log("listening on port 8000");
});
