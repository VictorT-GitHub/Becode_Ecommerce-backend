require("dotenv").config({ path: "./config/.env" });
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const productsRouter = require("./routes/productsController.js");
const cartsRouter = require("./routes/cartsController.js");
const usersRouter = require("./routes/usersController.js");
const authRouter = require("./routes/authController.js");

const app = express();
const PORT = 4000;

// Connection to MongoDB Atlas database
require("./config/dbConfig");

// Express Config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home-page Redirect to Products-page
app.get("/", (req, res) => {
  res.redirect("/products");
});

// Routers
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// 404 Middleware
app.use("/", (req, res) => {
  return res.status(404).send("Error404: page not found");
});

// Server
app.listen(PORT, () =>
  console.log(`server started: http://localhost:${PORT}/`)
);
