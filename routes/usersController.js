const router = require("express").Router();
const ObjectID = require("mongoose").Types.ObjectId;

const { UsersModel } = require("../models/usersModel.js");

// GET all Users
router.get("/", (req, res) => {
  UsersModel.find((err, data) => {
    if (err) console.log("GET users from db ERROR: " + err);
    else res.send(data);
  }).select("-password");
});

// GET one User
router.get("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR userID unknow: " + req.params.id);
  }
  UsersModel.findById(req.params.id, (err, data) => {
    if (err) console.log("GET user from db ERROR: " + err);
    else res.send(data);
  });
});

// POST new User (REGISTER)
router.post("/register", (req, res) => {
  // From frontend To Mongoose
  const newUser = new UsersModel({
    address: req.body.address,
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    admin: req.body.admin,
  });
  // From Mongoose To MongoDB
  newUser.save((err, data) => {
    if (err) console.log("Post user to db ERROR: " + err);
    else res.send(data);
  });
});

// UPDATE User
router.put("/:id", (req, res) => {
  // From frontend To Mongoose
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR userID unknow: " + req.params.id);
  }
  const updateUser = {
    address: req.body.address,
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
  };
  // From Mongoose To MongoDB
  UsersModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateUser },
    { new: true },
    (err, data) => {
      if (err) console.log("Update user ERROR: " + err);
      else res.send(data);
    }
  );
});

// DELETE User
router.delete("/:id", (req, res) => {
  // From frontend To Mongoose
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR userID unknow: " + req.params.id);
  }
  // From Mongoose To MongoDB
  UsersModel.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) console.log("Delete user ERROR: " + err);
    else res.send(data);
  });
});

module.exports = router;
