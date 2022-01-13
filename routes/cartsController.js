const router = require("express").Router();
const ObjectID = require("mongoose").Types.ObjectId;

const { CartsModel } = require("../models/cartsModel.js");

// GET all Carts
router.get("/", (req, res) => {
  CartsModel.find((err, data) => {
    if (err) console.log("GET carts from db ERROR: " + err);
    else res.send(data);
  });
});

// GET one Cart
router.get("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }
  CartsModel.findById(req.params.id, (err, data) => {
    if (err) console.log("GET cart from db ERROR: " + err);
    else res.send(data);
  });
});

// POST new Cart
router.post("/", (req, res) => {
  // From frontend To Mongoose
  const newCart = new CartsModel({
    userId: req.body.userId,
  });
  // From Mongoose To MongoDB
  newCart.save((err, data) => {
    if (err) console.log("Post cart to db ERROR: " + err);
    else res.send(data);
  });
});

// UPDATE Cart (?? $SET -or- $PUSH ??)
router.put("/:id", (req, res) => {
  // From frontend To Mongoose
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }
  const updateCart = {
    products: req.body.products,
  };
  // From Mongoose To MongoDB
  CartsModel.findByIdAndUpdate(
    req.params.id,
    { $push: updateCart }, // ?? $SET -or- $PUSH ??
    { new: true },
    (err, data) => {
      if (err) console.log("Update cart ERROR: " + err);
      else res.send(data);
    }
  );
});

// DELETE Cart
router.delete("/:id", (req, res) => {
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
