const router = require("express").Router();
const ObjectID = require("mongoose").Types.ObjectId;

const { UsersModel } = require("../models/usersModel.js");
const {
  checkAuthToken,
  checkIfAdmin,
} = require("../middleware/authMiddleware.js");

// ------------ CRUD USER ------------
// GET all Users
router.get("/all-users", checkAuthToken, checkIfAdmin, (req, res) => {
  UsersModel.find((err, data) => {
    if (err) res.status(400).send("GET users ERROR: " + err);
    else res.send(data);
  }).select("-password");
});

// GET one User ("VEROUILLED")
router.get("/myaccount/", checkAuthToken, (req, res) => {
  // -- READ ME --
  // A user can only read his one data, selected with
  // his [res.locals.user_id] which is located in the jwt-cookie.
  // So this GET request doesnt need any req.params.id in the URL.

  UsersModel.findById(res.locals.user_id, (err, data) => {
    if (err) res.status(400).send("GET user ERROR: " + err);
    else res.send(data);
  }).select("-password");
});

// UPDATE User
router.put("/:id", checkAuthToken, (req, res) => {
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

  UsersModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateUser },
    { new: true },
    (err, data) => {
      if (err) res.status(400).send("Update user ERROR: " + err);
      else res.send(data);
    }
  );
});

// DELETE User
router.delete("/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR userID unknow: " + req.params.id);
  }

  UsersModel.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) res.status(400).send("Delete user ERROR: " + err);
    else res.send(data);
  });
});

// ------------ CRUD PRODUCTS IN CART ------------
// ADD one Product to Cart
router.put("/add-product/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR userId unknow: " + req.params.id);
  }

  const newProduct = {
    cart: {
      productid: req.body.productid, // Pourquoi c'est pas obligé ?
      quantity: req.body.quantity,
    },
  };

  UsersModel.findByIdAndUpdate(
    req.params.id,
    { $push: newProduct },
    { new: true },
    (err, data) => {
      if (err) res.status(400).send("Add product to Cart ERROR: " + err);
      else res.send(data);
    }
  );
});

// Modify one Product in the Cart
router.put("/modify-product/:id", checkAuthToken, (req, res) => {
  const { _id, productid, quantity } = req.body;

  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(_id)) {
    return res.status(400).send("ERROR ID unknow");
  }

  UsersModel.findById(req.params.id, (err, user) => {
    if (err) return res.status(400).send("Update cart-product ERROR: " + err);

    const productToModify = user.cart.find((product) => product._id == _id);
    if (!productToModify) return res.status(404).send("Product not found");

    productToModify.productid = productid;
    productToModify.quantity = quantity;

    return user.save((err) => {
      if (err) return res.status(400).send("Save cart-product ERROR: " + err);
      return res.send(user);
    });
  });
});

// Delete one Product in the Cart
router.put("/delete-product/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body._id)) {
    return res.status(400).send("ERROR ID unknow");
  }

  const productToDelete = {
    cart: {
      _id: req.body._id,
    },
  };

  UsersModel.findByIdAndUpdate(
    req.params.id,
    { $pull: productToDelete },
    { new: true },
    (err, data) => {
      if (err) res.status(400).send("Delete cart-product ERROR: " + err);
      else res.send(data);
    }
  );
});

module.exports = router;
