const router = require("express").Router();
const ObjectID = require("mongoose").Types.ObjectId;

const { UsersModel } = require("../models/usersModel.js");
const { checkAuthToken } = require("../middleware/authMiddleware.js");
const { registerErrors } = require("../utils/errors.utils.js");

// GET all Users
router.get("/", checkAuthToken, (req, res) => {
  UsersModel.find((err, data) => {
    if (err) console.log("GET users from db ERROR: " + err);
    else res.send(data);
  }).select("-password");
});

// GET one User
router.get("/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR userID unknow: " + req.params.id);
  }
  UsersModel.findById(req.params.id, (err, data) => {
    if (err) console.log("GET user from db ERROR: " + err);
    else res.send(data);
  });
});

// POST new User (REGISTER)
router.post("/register", checkAuthToken, (req, res) => {
  const newUser = new UsersModel({
    address: req.body.address,
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    admin: req.body.admin,
  });

  newUser.save((err, data) => {
    if (err) {
      const errors = registerErrors(err);
      res.status(400).send({ errors });
    } else {
      res.status(201).send(data._id);
    }
  });
});

// UPDATE User
router.put("/:id", checkAuthToken, (req, res) => {
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
router.delete("/:id", checkAuthToken, (req, res) => {
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
