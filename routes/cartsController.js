const router = require("express").Router();
const ObjectID = require("mongoose").Types.ObjectId;

const { CartsModel } = require("../models/cartsModel.js");
const { checkAuthToken } = require("../middleware/authMiddleware.js");

// ------------ CRUD CART ------------
// GET all Carts
router.get("/", checkAuthToken, (req, res) => {
  CartsModel.find((err, data) => {
    if (err) res.status(400).send("GET carts ERROR: " + err);
    else res.send(data);
  });
});

// GET one Cart
router.get("/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }
  CartsModel.findById(req.params.id, (err, data) => {
    if (err) res.status(400).send("GET cart ERROR: " + err);
    else res.send(data);
  });
});

// POST new Cart ("VEROUILLED")
router.post("/", checkAuthToken, (req, res) => {
  // -- READ ME --
  // A user can only create a cart for himself with
  // his [res.locals.user_id] which is located in the jwt-cookie.
  // So this POST request doesnt need any req.body frontend inputs.

  const newCart = new CartsModel({
    userId: res.locals.user_id,
  });

  newCart.save((err, data) => {
    if (err) res.status(400).send(err);
    else res.status(201).send(data);
  });
});

// DELETE Cart
router.delete("/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }
  CartsModel.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) res.status(400).send("Delete cart ERROR: " + err);
    else res.send(data);
  });
});

// ------------ CRUD PRODUCTS IN CART ------------
// ADD one Product to Cart
router.put("/add-product/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ERROR cartID unknow: " + req.params.id);
  }

  const newProduct = {
    products: {
      productid: req.body.productid,
      quantity: req.body.quantity,
    },
  };

  CartsModel.findByIdAndUpdate(
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

  CartsModel.findById(req.params.id, (err, cart) => {
    if (err) return res.status(400).send("Update cart-product ERROR: " + err);

    const productToModify = cart.products.find((product) => product._id == _id);
    if (!productToModify) return res.status(404).send("Product not found");

    productToModify.productid = productid;
    productToModify.quantity = quantity;

    return cart.save((err) => {
      if (err) return res.status(400).send("Save cart-product ERROR: " + err);
      return res.send(cart);
    });
  });
});

// Delete one Product in the Cart
router.put("/delete-product/:id", checkAuthToken, (req, res) => {
  if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body._id)) {
    return res.status(400).send("ERROR ID unknow");
  }

  const productToDelete = {
    products: {
      _id: req.body._id,
    },
  };

  CartsModel.findByIdAndUpdate(
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
