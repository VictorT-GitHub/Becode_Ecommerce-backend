const router = require("express").Router();
const ObjectID = require("mongoose").Types.ObjectId;

const { CartsModel } = require("../models/cartsModel.js");
const { checkAuthToken } = require("../middleware/authMiddleware.js");

// GET all Carts
router.get("/", checkAuthToken, (req, res) => {
  CartsModel.find((err, data) => {
    if (err) console.log("GET carts from db ERROR: " + err);
    else res.send(data);
  });
});

// GET one Cart
router.get("/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }
  CartsModel.findById(req.params.id, (err, data) => {
    if (err) console.log("GET cart from db ERROR: " + err);
    else res.send(data);
  });
});

// POST new Cart
router.post("/", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.body.userId)) {
    return res.status(400).send("ERROR userID unknow: " + req.body.userId);
  }

  const newCart = new CartsModel({
    userId: req.body.userId,
  });

  newCart.save((err, data) => {
    if (err) res.status(400).send(err);
    else res.status(201).send(data);
  });
});

// ADD Product to Cart (?? $SET -or- $PUSH ??)
router.put("/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }

  const updateCart = {
    products: req.body.products,
  };

  CartsModel.findByIdAndUpdate(
    req.params.id,
    { $set: updateCart }, // ?? $SET -or- $PUSH -or- $ADDTOSET ??
    { new: true },
    (err, data) => {
      if (err) res.status(400).send(err);
      else res.send(data);
    }
  );
});

// DELETE Cart
router.delete("/:id", checkAuthToken, (req, res) => {
  // From frontend To Mongoose
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }
  // From Mongoose To MongoDB
  CartsModel.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) console.log("Delete cart ERROR: " + err);
    else res.send(data);
  });
});

module.exports = router;
