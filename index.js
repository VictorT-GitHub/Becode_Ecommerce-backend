const cors = require("cors");
const express = require("express");
require("dotenv").config({ path: "./config/.env" });

const productsRouter = require("./routes/productsController.js");
const usersRouter = require("./routes/usersController.js");
const cartsRouter = require("./routes/cartsController.js");

const app = express();
const PORT = 4000;

// Connection to MongoDB Atlas database
require("./config/dbConfig");

// Express Config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/carts", cartsRouter);

// Server
app.listen(PORT, () =>
  console.log(`server started: http://localhost:${PORT}/`)
);
