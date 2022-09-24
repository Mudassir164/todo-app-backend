const mongoose = require("mongoose");

// this code connect with data base
mongoose
  .connect(process.env.MANGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
