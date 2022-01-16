const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_CONNECT_URI,
  // { useNewUrlParser: true, useUnifiedTopology: true }, // inutile ?
  (err) => {
    if (err) console.log("[connection error to db: ] " + err);
    else console.log("Connected to MongoDB");
  }
);
